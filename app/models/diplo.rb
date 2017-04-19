require 'saxon-xslt'

class Diplo < ActiveRecord::Base
  
  belongs_to :transcription
  
  def self.create_diplo!( transcription )
    
    diplo = Diplo.new()    
    diplo.transcription = transcription
    
    tei_document = diplo.create_tei_document()

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
               
        xhtml = xslt.transform(doc,options).to_s    
        diplo.html_content = self.get_page(xhtml, transcription.leaf.xml_id )
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

    # remove dels and metamarks
    html_doc.search('.metamark,.del').each { |metamark| 
      metamark.remove
    }

    # add sentinels where there are brs
    html_doc.search("br").each { |br_node|
      node = Nokogiri::XML::Node.new('span',html_doc)
      node.content = "π"
      br_node.replace(node)
    }

    # remove all excess whitespace and put in newlines for sentinels
    text_nodes = html_doc.xpath("//*[text()]")
    text_nodes.each { |text_node|
      revised_content = text_node.content.tr("\n","") 
      revised_content.tr!("\t","")
      revised_content = revised_content.split.join(" ")
      revised_content.tr!("π","\n") 
      text_node.content = revised_content 
    }

    html_doc.root.to_str
  end

  def create_tei_document()
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
   tei_xml <<  "<text><body>\n#{self.transcription.content}\n</body></text>\n"
   tei_xml << "</TEI>"
   tei_xml
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