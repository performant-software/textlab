require 'saxon-xslt'

class Diplo < ActiveRecord::Base
  
  belongs_to :transcription
  
  def self.create_diplo!( transcription )
    
    diplo = Diplo.new()    
    diplo.transcription = transcription
    
    tei_document = diplo.create_tei_document()

    # TODO make sure it is valid
    # String xsdUrl = getServletContext().getResource(
    #     "/tei-xsl/xml/tei/stylesheet/xsd/tei_all.xsd").toString();
    # publisher.validateTeiDocument(tei, xsdUrl);
    #

    doc   = Saxon.XML(tei_document)
    xslt  = Saxon.XSLT(File.read('tei-xsl/xml/tei/stylesheet/html5/tei.xsl'))
    xhtml = xslt.transform(doc).to_s    
    
    return nil if !xhtml
    
    # extract: <span class="ab"> .. <div class="stdfooter"> or notes or pb
    start_match = xhtml.match(/<span class=\"ab\">/)
    
    if start_match
      end_match = xhtml.match(/<div class="(stdfooter|notes|pb)">/)
      if end_match
        start_pos = start_match.begin(0)
        length = end_match.begin(0) - start_pos    
        diplo.html_content = xhtml.slice(start_pos,length)
        diplo.save!
        diplo
      else
        return nil
      end
    else
      return nil
    end    
  end

  def create_tei_document()
   tei_xml = "<?xml-stylesheet type=\"text/xsl\" href=\"xml/tei/stylesheet/html5/tei.xsl\"?>"
   tei_xml << "<TEI xmlns=\"http://www.tei-c.org/ns/1.0\">"
   tei_xml << "<teiHeader></teiHeader>\n"
   tei_xml <<  "<facsimile></facsimile>\n"
   tei_xml <<  "<text><body>\n#{self.transcription.content}\n</body></text>\n"
   tei_xml << "</TEI>"
   tei_xml
  end
  

  def validate_tei( tei, xsd_url )
    #
    #
    # public void validateTeiDocument(String tei, String xsdUrl) throws MalformedURLException, SAXParseException, IOException {
    #       Source xml = new StreamSource(new StringReader(tei));
    #       URL schemaFile = new URL(xsdUrl);
    #       SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
    #       Schema schema;
    #       try {
    #           schema = schemaFactory.newSchema(schemaFile);
    #       } catch (SAXException e1) {
    #           throw new IOException("Unable to load XSD: " + e1.toString(), e1);
    #       }
    #       Validator validator = schema.newValidator();
    #
    #       try {
    #           validator.validate(xml);
    #       } catch (SAXParseException e) {
    #           // catch and rethrow the sax parse exception. it has more readable
    #           // details as to why the validation failed.
    #           throw e;
    #       } catch (SAXException e) {
    #           throw new IOException("Validation Failed", e);
    #       }
    #   }
  end

    
  def obj
    { 
      id: self.id,
      html_content: self.html_content
    }
  end
  
end