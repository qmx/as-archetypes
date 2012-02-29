#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
/*
 * JBoss, Home of Professional Open Source
 * Copyright 2012, Red Hat, Inc., and individual contributors
 * by the @authors tag. See the copyright.txt in the distribution for a
 * full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
Core JavaScript functionality for the application.  Performs the required
Restful calls, validates return values, and populates the member table.
 */

/* Get the member template */
function getMemberTemplate() {
    ${symbol_dollar}.ajax({
        url: "tmpl/member.tmpl",
        dataType: "html",
        success: function( data ) {
            ${symbol_dollar}( "head" ).append( data );
            updateMemberTable();
        }
    });
}

/* Builds the updated table for the member list */
function buildMemberRows(members) {
	return _.template( ${symbol_dollar}( "${symbol_pound}member-tmpl" ).html(), {"members": members});
}

/* Uses JAX-RS GET to retrieve current member list */
function updateMemberTable() {
    ${symbol_dollar}.ajax({
	   url: "/${parentArtifactId}-services/rest/members/json",
	   cache: false,
	   success: function(data) {
	       ${symbol_dollar}('${symbol_pound}members').empty().append(buildMemberRows(data));
       },
       error: function(error) {
            //console.log("error updating table -" + error.status);
       }
   });
}

/*
Attempts to register a new member using a JAX-RS POST.  The callbacks
the refresh the member table, or process JAX-RS response codes to update
the validation errors.
 */
function registerMember(formValues) {
   //clear existing  msgs
    ${symbol_dollar}('span.invalid').remove();
    ${symbol_dollar}('span.success').remove();

    ${symbol_dollar}.post('/${parentArtifactId}-services/rest/members', formValues,
         function(data) {
            //console.log("Member registered");

            //clear input fields
            ${symbol_dollar}('${symbol_pound}reg')[0].reset();

            //mark success on the registration form
            ${symbol_dollar}('${symbol_pound}formMsgs').append(${symbol_dollar}('<span class="success">Member Registered</span>'));

            updateMemberTable();
         }).error(function(error) {
            if ((error.status == 409) || (error.status == 400)) {
               //console.log("Validation error registering user!");

               var errorMsg = ${symbol_dollar}.parseJSON(error.responseText);

               ${symbol_dollar}.each(errorMsg, function(index, val){
                   ${symbol_dollar}('<span class="invalid">' + val + '</span>')
                        .insertAfter(${symbol_dollar}('${symbol_pound}' + index));
               });
            } else {
               //console.log("error - unknown server issue");
                ${symbol_dollar}('${symbol_pound}formMsgs').append(${symbol_dollar}('<span class="invalid">Unknown server error</span>'));
            }
         });
}

//small workaround for browsers which do not support overflow scrolling *cough* Android *cough*
//this is for x axis and would need modification with scrollTop and pageY to support up/down scrolling
function touchScrollX(id)
{
  if (Modernizr.touch) {
        var el=document.querySelector(id);
        var scrollStartPos=0;

        el.addEventListener("touchstart", function(event) {
            scrollStartPos=this.scrollLeft+event.touches[0].pageX;
            event.preventDefault();
        },false);

        el.addEventListener("touchmove", function(event) {
            this.scrollLeft=scrollStartPos-event.touches[0].pageX;
            event.preventDefault();
        },false);
  }
}