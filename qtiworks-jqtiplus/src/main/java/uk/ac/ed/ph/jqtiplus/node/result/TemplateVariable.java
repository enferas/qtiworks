/* Copyright (c) 2012, University of Edinburgh.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice, this
 *   list of conditions and the following disclaimer in the documentation and/or
 *   other materials provided with the distribution.
 *
 * * Neither the name of the University of Edinburgh nor the names of its
 *   contributors may be used to endorse or promote products derived from this
 *   software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * This software is derived from (and contains code from) QTItools and MathAssessEngine.
 * QTItools is (c) 2008, University of Southampton.
 * MathAssessEngine is (c) 2010, University of Edinburgh.
 */
package uk.ac.ed.ph.jqtiplus.node.result;

import uk.ac.ed.ph.jqtiplus.group.shared.FieldValueGroup;
import uk.ac.ed.ph.jqtiplus.node.item.template.declaration.TemplateDeclaration;
import uk.ac.ed.ph.jqtiplus.node.shared.FieldValue;
import uk.ac.ed.ph.jqtiplus.node.shared.FieldValueParent;
import uk.ac.ed.ph.jqtiplus.value.Value;

import java.util.List;

/**
 * Template variables are declared by template declarations.
 * 
 * @author Jonathon Hare
 */
public class TemplateVariable extends ItemVariable implements FieldValueParent {

    private static final long serialVersionUID = 1551667865654592820L;

    /** Name of this class in xml schema. */
    public static final String QTI_CLASS_NAME = "templateVariable";

    public TemplateVariable(AbstractResult parent) {
        super(parent, QTI_CLASS_NAME);
        getNodeGroups().add(new FieldValueGroup(this, null, null));
    }

    /**
     * Creates new templateVariable from a given templateDeclaration.
     * 
     * @param parent parent of created templateVariable
     * @param declaration given templateDeclaration
     */
    public TemplateVariable(AbstractResult parent, TemplateDeclaration declaration, Value value) {
        this(parent);
        if (declaration != null) {
            setIdentifier(declaration.getIdentifier().toVariableReferenceIdentifier());
            setCardinality(declaration.getCardinality());
            setBaseType(declaration.getBaseType());
            getFieldValues().addAll(FieldValue.getValues(this, value));
        }
    }

    /**
     * Gets fieldValue children.
     * 
     * @return fieldValue children
     */
    public List<FieldValue> getFieldValues() {
        return getNodeGroups().getFieldValueGroup().getFieldValues();
    }

    /**
     * Gets value of this variableDeclaration.
     * 
     * @return value of this variableDeclaration
     */
    public Value getValue() {
        return FieldValue.getValue(getCardinality(), getFieldValues());
    }
}