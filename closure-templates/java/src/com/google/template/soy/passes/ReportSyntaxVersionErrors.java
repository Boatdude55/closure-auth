/*
 * Copyright 2008 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.template.soy.passes;

import com.google.common.base.Preconditions;
import com.google.template.soy.basetree.Node;
import com.google.template.soy.basetree.NodeVisitor;
import com.google.template.soy.basetree.SyntaxVersion;
import com.google.template.soy.basetree.SyntaxVersionUpperBound;
import com.google.template.soy.error.ErrorReporter;
import com.google.template.soy.error.SoyErrorKind;
import com.google.template.soy.error.SoyErrorKind.StyleAllowance;
import com.google.template.soy.exprtree.FunctionNode;
import com.google.template.soy.shared.internal.BuiltinFunction;
import com.google.template.soy.soytree.SoyFileNode;
import com.google.template.soy.soytree.SoyTreeUtils;
import com.google.template.soy.soytree.SoyTreeUtils.VisitDirective;
import com.google.template.soy.soytree.TemplateNode;

/**
 * Reports syntax version errors for unparsed expressions and {@link SyntaxVersionUpperBound}s that
 * aren't compatible with a required version.
 *
 */
final class ReportSyntaxVersionErrors {

  private static final SoyErrorKind INCORRECT_V1_SYNTAX =
      SoyErrorKind.of("Incorrect syntax for version {0}: {1}", StyleAllowance.NO_PUNCTUATION);
  private static final SoyErrorKind DECLARED_VERSION_NOT_SATISFIED =
      SoyErrorKind.of(
          "Declared syntax version {0} not satisfied: {1}", StyleAllowance.NO_PUNCTUATION);
  private static final SoyErrorKind INFERRED_VERSION_NOT_SATISFIED =
      SoyErrorKind.of(
          "Inferred syntax version {0} not satisfied: {1}", StyleAllowance.NO_PUNCTUATION);

  private final SyntaxVersion requiredSyntaxVersion;
  private final ErrorReporter errorReporter;
  private final SoyErrorKind errorKind;

  /**
   * @param requiredSyntaxVersion The required minimum syntax version to check for.
   * @param isDeclared True if the required syntax version that we're checking for is user-declared.
   *     False if it is inferred.
   * @param errorReporter For reporting errors.
   */
  ReportSyntaxVersionErrors(
      SyntaxVersion requiredSyntaxVersion, boolean isDeclared, ErrorReporter errorReporter) {
    this.errorReporter = errorReporter;
    this.requiredSyntaxVersion = requiredSyntaxVersion;
    this.errorKind =
        (requiredSyntaxVersion == SyntaxVersion.V1_0)
            ? INCORRECT_V1_SYNTAX
            : (isDeclared ? DECLARED_VERSION_NOT_SATISFIED : INFERRED_VERSION_NOT_SATISFIED);
  }

  public void report(SoyFileNode node) {
    for (final TemplateNode template : node.getChildren()) {
      SoyTreeUtils.visitAllNodes(
          template,
          new NodeVisitor<Node, VisitDirective>() {
            @Override
            public VisitDirective exec(Node node) {
              visitNode(template, node);
              return VisitDirective.CONTINUE;
            }
          });
    }
  }

  private void visitNode(TemplateNode template, Node node) {
    if (!node.couldHaveSyntaxVersionAtLeast(requiredSyntaxVersion)) {
      SyntaxVersionUpperBound syntaxVersionBound = node.getSyntaxVersionUpperBound();
      Preconditions.checkNotNull(syntaxVersionBound);
      errorReporter.report(
          node.getSourceLocation(), errorKind, requiredSyntaxVersion, syntaxVersionBound.reasonStr);
    }
    if (node instanceof FunctionNode) {
      String functionName = ((FunctionNode) node).getFunctionName();
      if (functionName.equals(BuiltinFunction.V1_EXPRESSION.getName())
          && template.couldHaveSyntaxVersionAtLeast(SyntaxVersion.V2_0)) {
        errorReporter.report(
            node.getSourceLocation(),
            errorKind,
            requiredSyntaxVersion,
            "The v1Expression function can only be used in templates marked with the "
                + "deprecatedV1=\"true\" attribute.");
      }
    }
  }
}
