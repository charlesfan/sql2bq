20130624
  Remove xml2json lib dependency (in lib/git/xml2json.js) that use node-expat. It will depend on C++ library, that will cause library failed when change node version.
