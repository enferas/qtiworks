<%--

Copyright (c) 2012, The University of Edinburgh.
All Rights Reserved

--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="validator" tagdir="/WEB-INF/tags/validator" %>
<%--

Validator submission form

Model attributes:

result (AssessmentUploadAndValidationResultV1)

--%>
<c:set var="assessmentPackage" value="${result.assessmentPackage}"/>
<c:set var="validationResult" value="${result.validationResult}"/>
<c:set var="assessmentType" value="${validationResult.resolvedAssessmentObject.type}"/>

<%-- Generate header --%>
<c:set var="title" value="QTI Validator" />
<%@ include file="/WEB-INF/jsp/includes/header.jspf" %>

<p>You uploaded an ${assessmentType}, uploaded as ${assessmentPackage.importType}.</p>


<div class="validationResult">
  <c:choose>
    <c:when test="${assessmentType=='ASSESSMENT_ITEM'}">
      <validator:itemValidationResults validationResult="${validationResult}"/>
    </c:when>
    <c:when test="${assessmentType=='ASSESSMENT_TEST'}">
      <validator:testValidationResults validationResult="${validationResult}"/>
    </c:when>
    <c:otherwise>
      <%-- Blow up! --%>
    </c:otherwise>
  </c:choose>
</div>

<%@ include file="/WEB-INF/jsp/includes/footer.jspf" %>
