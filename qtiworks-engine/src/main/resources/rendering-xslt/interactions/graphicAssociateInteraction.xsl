<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:qti="http://www.imsglobal.org/xsd/imsqti_v2p1"
  xmlns:qw="http://www.ph.ed.ac.uk/qtiworks"
  xmlns="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="qti qw xs">

  <xsl:template match="qti:graphicAssociateInteraction">
    <input name="qtiworks_presented_{@responseIdentifier}" type="hidden" value="1"/>
    <div class="{local-name()}">
      <xsl:if test="qti:prompt">
        <div class="prompt">
          <xsl:apply-templates select="qti:prompt"/>
        </div>
      </xsl:if>
      <xsl:if test="qw:is-invalid-response(@responseIdentifier)">
        <xsl:call-template name="qw:generic-bad-response-message"/>
      </xsl:if>

      <xsl:variable name="object" select="qti:object" as="element(qti:object)"/>
<!--      
      <xsl:variable name="appletContainerId" select="concat('qtiworks_id_appletContainer_', @responseIdentifier)" as="xs:string"/>
      <div id="{$appletContainerId}" class="appletContainer">          
        <object type="application/x-java-applet" height="{$object/@height + 40}" width="{$object/@width}">
          <param name="code" value="BoundedGraphicalApplet"/>
          <param name="codebase" value="{$appletCodebase}"/>
          <param name="identifier" value="{@responseIdentifier}"/>
          <param name="baseType" value="pair"/>
          <param name="operation_mode" value="graphic_associate_interaction"/>
          <!- - (BoundedGraphicalApplet uses -1 to represent 'unlimited') - ->
          <param name="number_of_responses" value="{if (@maxAssociations &gt; 0) then @maxAssociations else -1}"/>
          <param name="background_image" value="{qw:convert-link($object/@data)}"/>
          <xsl:variable name="hotspots" select="qw:filter-visible(qti:associableHotspot)" as="element(qti:associableHotspot)*"/>
          <param name="hotspot_count" value="{count($hotspots)}"/>
          <xsl:for-each select="$hotspots">
            <param name="hotspot{position()-1}">
              <xsl:attribute name="value"><xsl:value-of select="@identifier"/>::::<xsl:value-of select="@shape"/>::<xsl:value-of select="@coords"/><xsl:if test="@label">::hotSpotLabel:<xsl:value-of select="@label"/></xsl:if><xsl:if test="@matchGroup">::<xsl:value-of select="translate(normalize-space(@matchGroup), ' ', '::')"/></xsl:if><xsl:if test="@matchMax">::maxAssociations:<xsl:value-of select="@matchMax"/></xsl:if></xsl:attribute>
            </param>
          </xsl:for-each>
          <xsl:variable name="responseValue" select="qw:get-response-value(/, @responseIdentifier)" as="element(qw:responseVariable)?"/>
          <xsl:if test="qw:is-not-null-value($responseValue)">
            <param name="feedback">
              <xsl:attribute name="value">
                <xsl:value-of select="$responseValue/qw:value" separator=","/>
              </xsl:attribute>
            </param>
          </xsl:if>
        </object>
        <script type="text/javascript">
          $(document).ready(function() {
            QtiWorksRendering.registerAppletBasedInteractionContainer('<xsl:value-of
              select="$appletContainerId"/>', ['<xsl:value-of select="@responseIdentifier"/>']);
          });
        </script>
      </div>
-->
      <script src="{$webappContextPath}/lib/easeljs-0.6.1.min.js"/>
      <script src="{$webappContextPath}/lib/movieclip-0.6.1.min.js"/>
      <script src="{$webappContextPath}/lib/preloadjs-0.3.1.min.js"/>
      <script src="{$webappContextPath}/lib/tweenjs-0.4.1.min.js"/>
      
      <script src="{$webappContextPath}/rendering/javascript/canvas/canvasUtilities.js"/>
      <script src="{$webappContextPath}/rendering/javascript/canvas/graphicAssociationCanvas.js"/>
        
      <xsl:variable name="graphicAssociationContainerId" select="concat('qtiworks_id_graphicAssociationContainer_', @responseIdentifier)" as="xs:string"/>
      <div id="{$graphicAssociationContainerId}">
            <xsl:variable name="hotspots" select="qw:filter-visible(qti:associableHotspot)" as="element(qti:associableHotspot)*"/>
            <xsl:variable name="responseValue" select="qw:get-response-value(/, @responseIdentifier)" as="element(qw:responseVariable)?"/>
            
            <script type="text/javascript">
                $(document).ready(function() {
                    var hotspots = [];
                    <xsl:for-each select="$hotspots">
                    hotspots.push({
                                    'identifier' : '<xsl:value-of select="@identifier"/>',
                                    'shape' : '<xsl:value-of select="@shape"/>',
                                    'coords' : '<xsl:value-of select="@coords"/>',
                                    'label' : '<xsl:if test="@label"><xsl:value-of select="@label"/></xsl:if>',
                                    'matchGroup' : '<xsl:if test="@matchGroup"><xsl:value-of select="translate(normalize-space(@matchGroup), ' ', '::')"/></xsl:if>',
                                    'matchMax' : '<xsl:value-of select="if (@matchMax &gt; 0) then @matchMax else -1"/>',
                                    'matchMin' : '<xsl:value-of select="if (@matchMin &gt; 0) then @matchMin else -1"/>'
                                 });
                    </xsl:for-each>
                    
                    QtiWorksRendering.registerGraphicAssociationInteraction(
                        '<xsl:value-of select="$graphicAssociationContainerId"/>',
                        '<xsl:value-of select="@responseIdentifier"/>',
                        <xsl:value-of select="if (@maxAssociations &gt; 0) then @maxAssociations else -1"/>, <xsl:value-of select="if (@minAssociations &gt; 0) then @minAssociations else -1"/>,
                        <xsl:value-of select="$object/@width"/>, <xsl:value-of select="$object/@height + 40"/>,
                        '<xsl:value-of select="qw:convert-link($object/@data)"/>',
                        hotspots,
                        '<xsl:if test="qw:is-not-null-value($responseValue)"><xsl:value-of select="$responseValue/qw:value" separator=","/></xsl:if>'
                    );
                    
                });
            </script>          
      </div > 
    </div>
  </xsl:template>
</xsl:stylesheet>
