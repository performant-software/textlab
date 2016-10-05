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
    #        if (!sProjectName.equals("")) {
    #            substitutions.put("\\[\\[PROJECT_NAME\\]\\]", sProjectName);
    #        } else if (!sTranscriptionId.equals("")) {
    #            substitutions.put("\\[\\[PROJECT_NAME\\]\\]", sTranscriptionId);
    #        }
    
   tei_xml = "<?xml-stylesheet type=\"text/xsl\" href=\"xml/tei/stylesheet/html5/tei.xsl\"?>"
   tei_xml << "<TEI xmlns=\"http://www.tei-c.org/ns/1.0\">"
   tei_xml << self.create_tei_header_element()
   tei_xml << self.create_facsimile_element()
   tei_xml << self.create_text_element()
   tei_xml << "</TEI>"
   tei_xml

    # TODO do we need this?
    #        sTeiXml = doSubstitutions(sTeiXml, substitutions);
    #        return sTeiXml;
    #    }
  end
  
  
  def create_tei_header_element
    
    #
    #        String theQuery = "SELECT TranscriptionText from transcription WHERE ManuscriptId = ? AND Type = ?";
    #        query.executePS(theQuery, sManuscriptId, Transcription.OFFICIAL_HEADER);
    #
    #        if (!query.isError() && query.getRecordCount() > 0) {
    #            header = query.getColumn("TranscriptionText");
    #        }
    #
    header = ""

    "<teiHeader>#{header}</teiHeader>\n"

  end
  
  def create_text_element
    "<text><body>\n#{self.transcription.content}\n</body></text>\n"
  end
  
  def create_facsimile_element
    
    facsimile = ""
    "<facsimile>#{facsimile}</facsimile>\n"
    
    #    public String createFacsimileElement() throws Exception {
    #        String facsimileOpen = "<facsimile>";
    #        String facsimileClose = "</facsimile>\n";
    #        String facsimile = "";
    #
    #        String theQuery = "SELECT l.Id AS leafid, l.Name as leafname, u.Width, u.Height, l.OrderNo "
    #            + "FROM leaf l LEFT JOIN uploads u ON l.Id = u.id WHERE l.ManuscriptId = ?";
    #        query.executePS(theQuery, sManuscriptId);
    #
    #        if (query.isError()) {
    #            throw new Exception("Query Error when searching for leafs.<br>" + query.getErrorStr());
    #        } else if (query.getRecordCount() < 1) {
    #            facsimile = "<!-- NO LEAFS WERE FOUND -->";
    #            return "";
    #        } else {
    #            String reIsNotAlpha = "^[^a-zA-Z].*$";
    #            do {
    #                String sLeafId = query.getColumn("leafid");
    #                String sLeafName = query.getColumn("leafname");
    #                String sWidth = query.getColumn("Width");
    #                String sHeight = query.getColumn("Height");
    #                int iOrderNo = Integer.parseInt(query.getColumn("OrderNo"));
    #                String sImgName = sLeafId + ".png";
    #
    #                String sOriginalLeafName = sLeafName;
    #                String sZonePrefix = sLeafName;
    #
    #                if (sLeafName.matches(reIsNotAlpha)) {
    #                    substitutions.put("\"#" + sLeafName + "\"", "\"#LEAF__" + sLeafName + "\"");
    #                    sLeafName = "LEAF__" + sLeafName;
    #                    sZonePrefix = "ZONE__" + sOriginalLeafName;
    #                }
    #
    #                substitutions.put("\\[\\[LEAF_ORDER_#" + sLeafName + "\\]\\]", Integer.toString(iOrderNo + 1));
    #
    #                if (sWidth.equals("")) {
    #                    sWidth = "0";
    #                }
    #                if (sHeight.equals("")) {
    #                    sHeight = "0";
    #                }
    #
    #                // ADD TAGS SPECIFIC TO LEAVES HERE
    #                facsimile += "<surface xml:id=\"" + sLeafName + "\" ulx=\"0\" uly=\"0\" lrx=\"" + sWidth + "\" lry=\""
    #                    + sHeight + "\">";
    #                facsimile += "<graphic url=\"" + "/TextLab" + "/srcimages/" + sImgName + "\"></graphic>";
    #
    #                theQuery = "SELECT rs.id, rs.polygon, rs.sitenum FROM revisionsite rs WHERE rs.leafid = ?";
    #                query2.executePS(theQuery, sLeafId);
    #                if (!query2.isError() && query2.getRecordCount() > 0) {
    #                    do {
    #                        // OUTPUT MANUSCRIPT AND ADD TO RESPONSE JSON OBJECT
    #                        String sSiteNum = query2.getColumn("sitenum");
    #                        String sPolygonCoords = query2.getColumn("polygon");
    #                        String sXmlId = sZonePrefix + "-";
    #
    #                        String tmpNum = "0000" + sSiteNum;
    #                        tmpNum = tmpNum.substring(tmpNum.length() - 4);
    #                        sXmlId += tmpNum;
    #
    #                        if (!sZonePrefix.equals(sOriginalLeafName)) {
    #                            substitutions.put("\"#" + sOriginalLeafName + "-" + tmpNum + "\"", "\"#" + sXmlId + "\"");
    #                        }
    #
    #                        // CONVERT STRING TO ARRAY
    #                        String[] saPolygons = sPolygonCoords.split(",");
    #
    #                        // EVERY OTHER ITEM IS A START OF A COORDINATE
    #                        int[] iaPolygonsX = new int[saPolygons.length / 2];
    #                        int[] iaPolygonsY = new int[saPolygons.length / 2];
    #                        int xctr = 0;
    #                        int yctr = 0;
    #
    #                        // CONVERT THEM TO INDIVIDUAL ARRAYS SO WE CAN DETERMINE HIGHEST/LOWEST COORDS
    #                        for (int k = 0; k < saPolygons.length; k++) {
    #                            if (k % 2 == 0) {
    #                                int tmpInt = -1;
    #                                try {
    #                                    tmpInt = Integer.parseInt(saPolygons[k]);
    #                                } catch (Exception e) {
    #                                }
    #                                iaPolygonsX[xctr] = tmpInt;
    #                                xctr++;
    #
    #                            } else {
    #                                int tmpInt = -1;
    #                                try {
    #                                    tmpInt = Integer.parseInt(saPolygons[k]);
    #                                } catch (Exception e) {
    #                                }
    #                                iaPolygonsY[yctr] = tmpInt;
    #                                yctr++;
    #                            }
    #                        }
    #
    #                        // NOW DETERMINE LOWEST X, LOWEST Y, HIGHEST X, HIGHEST Y
    #                        // SORT ARRAYS
    #                        java.util.Arrays.sort(iaPolygonsX);
    #                        java.util.Arrays.sort(iaPolygonsY);
    #
    #                        int iLowestX = iaPolygonsX[0];
    #                        int iLowestY = iaPolygonsY[0];
    #                        int iHighestX = iaPolygonsX[iaPolygonsX.length - 1];
    #                        int iHighestY = iaPolygonsY[iaPolygonsY.length - 1];
    #                        facsimile += "<zone xml:id=\"" + sXmlId + "\" ulx=\"" + iLowestX + "\" uly=\"" + iLowestY
    #                            + "\" lrx=\"" + iHighestX + "\" lry=\"" + iHighestY + "\"></zone>";
    #                    } while (query2.next());
    #                }
    #
    #                facsimile += "</surface>";
    #            } while (query.next());
    #        }
    #        return facsimileOpen + facsimile + facsimileClose;
    #    }
    
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