# coding: utf-8
require 'saxon-xslt'

class Diplo < ActiveRecord::Base

  belongs_to :transcription

  attr_accessor :raw_xhtml

  def self.regenerate_all_diplos!()
    Transcription.where('document_id is not null').each { |transcription|
      # only regenerate diplos that have been previously been generated
      unless transcription.diplo.nil?
        transcription.diplo.delete
        Diplo.create_diplo!(transcription)
      end
    }
  end

  def self.create_diplo!( transcription )

    diplo = Diplo.new()
    diplo.transcription = transcription

    xml_fragment = Diplo.remove_omitted_tags( transcription )
    tei_document = Diplo.create_tei_document( xml_fragment )

    syntax_errors = self.validate_tei( tei_document )

    if syntax_errors and syntax_errors.length > 0
      diplo.error = true
      diplo.html_content = "<ul>"
      syntax_errors.each { |error|
        diplo.html_content << "<li>#{error}</li>"
      }
      diplo.html_content << "</ul>"
    else
      begin
        doc   = Saxon.XML(tei_document)
        xslt  = Saxon.XSLT(File.read('tei-xsl/xml/tei/stylesheet/html5/tei.xsl'))
        # TODO these options don't work, is there a way to config Saxon from here?
        options = { "indent" => "'no'", "encoding" => "'utf-8'" }

        diplo.raw_xhtml = xslt.transform(doc,options).to_s
        diplo.html_content = self.get_page(diplo.raw_xhtml, transcription.leaf.xml_id )
        diplo.error = false
      rescue Exception => e
        diplo.error = true
        diplo.html_content = e.to_s
      end
    end

    diplo.save!
    diplo
  end

  def base_text
    html_doc = Nokogiri::HTML("<html><body>#{self.html_content}</body></html>")

    # remove metamarks
    html_doc.search('.metamark').each { |metamark|
      metamark.remove
    }

    # remove dels except those with restore tags as immediate parent
    #
    # example XML:
    # <restore change="StDa" hand="#HM" facs="#img_7-0016" >
    #   <del rend="single-stroke _HMp" hand="#HM" change="StDa" facs="#img_7-0016" >lesser</del>
    # </restore>
    #
    # HTML:
    # <span class="restore" facs="#img_7-0016">
    #    <span class="del" facs="#img_7-0016">
    #       <span class="single-stroke _HMp">lesser</span>
    #    </span>
    # </span>
    html_doc.search('.del').each { |del|
      unless del.matches?('.restore > .del')
        del.remove
      end
    }

    # add sentinels where there are brs
    html_doc.search("br").each { |br_node|
      node = Nokogiri::XML::Node.new('span',html_doc)
      node.content = "π"
      br_node.replace(node)
    }

    # remove all excess whitespace and put whitespace for sentinels
    text_nodes = html_doc.xpath("//*[text()]")
    text_nodes.each { |text_node|
      revised_content = text_node.content.tr("\n","")
      revised_content.tr!("\t","")
      revised_content = revised_content.split.join(" ")
      revised_content.tr!("π"," ")
      text_node.content = revised_content
    }

    html_doc.root.to_str
  end

  def self.create_tei_document( xml_fragment )
   tei_xml = "<?xml-stylesheet type=\"text/xsl\" href=\"xml/tei/stylesheet/html5/tei.xsl\"?>"
   tei_xml << "<TEI xmlns=\"http://www.tei-c.org/ns/1.0\">"
   tei_xml << "<teiHeader><fileDesc>
              <titleStmt>
              <title>one</title>
              </titleStmt>
              <publicationStmt>
              <publisher/>
              <pubPlace/>
              <date/>
              <authority/>
              <availability>
              <p/>
              </availability>
              </publicationStmt>
              <sourceDesc>
              <p/>
              </sourceDesc>
              </fileDesc></teiHeader>\n"
   tei_xml <<  "<text><body>\n#{xml_fragment}\n</body></text>\n"
   tei_xml << "</TEI>"
   tei_xml
  end

  def self.remove_omitted_tags( transcription )
    omitted_tags = transcription.document.project_config.omitted_tags

    xml_fragment = transcription.content
    omitted_tags.each { |omitted_tag|
      xml_fragment = Diplo.remove_tag( xml_fragment, omitted_tag )
    } unless xml_fragment.blank?
    xml_fragment
  end

  def self.remove_tag( xml_fragment, tag )
    result = xml_fragment
    loop do
      # find opening and closing tags of this element and remove them
      parts = result.partition(/<[\/]?#{tag}(\s[^>]*>|[\/]?>)/)
      result = parts.first + parts.last
      break if parts[1] == ""
    end
    result
  end

  def self.get_page( xhtml, leaf_xml_id )
    # extract: <span class="ab"> .. <div class="stdfooter"> or notes or pb
    start_match = xhtml.match(/<span class=\"ab\">/)

    if start_match
      end_match = xhtml.match(/<div class="(stdfooter|notes|pb)">/)
      if end_match
        start_pos = start_match.begin(0)
        length = end_match.begin(0) - start_pos
        return "<div class='transcription' id='#{leaf_xml_id}'>#{xhtml.slice(start_pos,length)}"
      end
    end

    return nil
  end

  def self.validate_tei( tei_document )
    xsd = Nokogiri::XML::Schema(File.read("tei-xsl/xml/tei/stylesheet/xsd/tei_all.xsd"))
    doc = Nokogiri::XML(tei_document)
    return xsd.validate(doc)
  end

  def obj
    {
      id: self.id,
      html_content: self.html_content
    }
  end

end
