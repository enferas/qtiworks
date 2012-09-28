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
package uk.ac.ed.ph.qtiworks.samples;

/**
 * Sample set containing examples of the MathAssess extensions
 *
 * @author David McKain
 */
public final class MathAssessSampleSet {
    
    private static final QtiSampleSet instance = new QtiSampleSet("MathAssess examples",
            "These are the 'MathAssess' examples, which demonstrate the MathAssess QTI extensions "
            + "that allow you to use the Maxima Computer Algebra system for some very sophisticated "
            + "assessment.",
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_STANDARD, "mathassess/MAA01a.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_STANDARD, "mathassess/MAB01a.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MAC02-SR.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MAD01-SRinCO-demo.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MAD01-newSRinRP.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MAD03a.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MAD04-ltgt-tVars.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MAD05-Factors-CC.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MAD05-Factors-SR.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MAD06-Diff.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MANum01CP.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/MANum01SR.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/Diff-001.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/GU-Formulae-006-BMI.xml"),
            new QtiSampleAssessment(DeliveryStyle.MATHASSESS_TEMPLATED, "mathassess/diag00001.xml")
    );
    
    private MathAssessSampleSet() {
        /* No constructor */
    }
    
    public static QtiSampleSet instance() {
        return instance;
    }
}
