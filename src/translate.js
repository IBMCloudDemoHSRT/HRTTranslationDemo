//import "./detect-language.js";

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when teh action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
  const { IamAuthenticator } = require('ibm-watson/auth');

  const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
      apikey: 'erVQB65Csy6SLHjs81cFvFh6TfFOtEMYpviR9iBtFaiE',
    }),
    serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/942b7e56-9f66-49be-80b2-36f7f351b247',
  });

  const translateParams = {
    text: params.body.text,
	source: params.body.language,
    target: "en"
  };
/*
  const translateParams = {
  text: 'Hello, how are you today?',
  modelId: 'en-de',
};*/

  return new Promise(function (resolve, reject) {

    try {

      // *******TODO**********
      // - Call the language translation API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#translate
      // - if successful, resolve exatly like shown below with the
      // translated text in the "translation" property,
      // the number of translated words in "words"
      // and the number of characters in "characters".

      // in case of errors during the call resolve with an error message according to the pattern
      // found in the catch clause below

      // pick the language with the highest confidence, and send it back
		console.log(translateParams);
		if((typeof translateParams.text == "string") && (translateParams.source != null) && (translateParams.target != null)){
      languageTranslator.translate(translateParams)
          .then(translationResult => {
            console.log(JSON.stringify(translationResult, null, 2));
            resolve({
              statusCode: 200,
              body: {
				detected_input_language: translateParams.source,
                translations: translationResult.result.translations[0].translation,
                words: translationResult.result.word_count,
                characters: translationResult.result.character_count,
              },
              headers: { 'Content-Type': 'application/json' }
            });
          })
          .catch(err => {
            console.error('Error while initializing the AI service', err);
            resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
          });
		}
/*
languageTranslator.translate(translateParams)
  .then(translationResult => {
    console.log(JSON.stringify(translationResult, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });*/
         
    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
