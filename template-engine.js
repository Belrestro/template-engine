(function(factory) {
    let root = self;
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory($);
        });
    }  else {
        return factory(root.jQuery);
    }

})(function($){
    const presetValues = ["root","_content","_templateData","_templateVariables"],
        presetStatements = ['repeat', 'if'];
    let engine = {
        config : {
            paths : {
                base : 'templates',
                snippet : 'snippet',
                chunk : 'chunk',
                page : 'page',
            },
            extension : '.tpl',
        }
    };
    Object.defineProperty(engine, '_data', {
        enumerable : false,
        configurable : false,
        value : {
            root : null,
            templateLine : [],
            fullTemplateData : {},
        }
    });
    function checkIfInSet(set, value){
        return Object.keys(set).some(function(key){
            return set[key] === value || key === value;
        });
    }
    function inPresetValues(value){
        return  checkIfInSet(presetValues.concat(presetStatements), value);
    }
    function isTemplate(segmentName){
        return Boolean(new RegExp(engine.config.extension+'$').exec(segmentName));
    }
    function buildTemplateLink(templateName, templateType){
        const config = engine.config,
            link = checkIfInSet(config.paths, templateType) ? templateType + '/' : 'part/';
        return  './' + config.paths.base + '/' + link + templateName + config.extension;
    }
    function loadTemplate(path,callback){
        $.ajax({
            url: path,
            type: 'GET',
            success : function (loadedData){
                callback(loadedData)
            }, error : function (error) {
                console.log(error);
                callback('');
            }
        });
    }
    function parseSegments(segment){
        let snippets = segment.match(/\{\{[^}/\n]+}}/g),
            snippetData = [];
        if(snippets) {
            snippets.forEach(function(snippet){
                let snippetContent = snippet.replace(/\{\{|}}/g,''),
                    parameters = snippetContent.match(/(\s[^"]+=["|'][^"]+)["|']/g),
                    snippetName = /^\S+/.exec(snippetContent)[0],
                    data = {
                        name: snippetName.match(/^[^.]+/)[0],
                        fullName : snippetName,
                        content : snippet,
                        parameters: {},
                    };
                if(inPresetValues(data.name)) return;
                if(parameters){
                    parameters.forEach(function(parameter){
                        let parts = parameter.match(/([^\s=]+)=['"](.+)['"]/);
                        if(parts && parts[1] && parts[2] && !parameters[parts[1]]) {
                            data.parameters[parts[1]] = parts[2];
                        }
                    });
                }
                snippetData.push(data);
            });
        }
        return snippetData;
    }
    function searchForStatementMatches(segment, statementType, arrayOfMatches){
        let startRegExp = new RegExp('\{\{\\s*'+statementType+'\\s+!?[\\s\\w]+\\s*}}','g'),
            endRegExp = new RegExp('\{\{\/\\s*'+statementType+'\\s*}}', 'g'),
            beginnings = segment.match(startRegExp),
            endings = segment.match(endRegExp);
        if(beginnings && endings){
            if(!arrayOfMatches) arrayOfMatches = [];
            while(beginnings.length > 0 && endings.length > 0){
                let start = beginnings.shift(),
                    end = endings.shift(),
                    endPosition = segment.indexOf(end)+end.length,
                    restOfString = segment.slice(endPosition),
                    currentSegment = segment.slice(segment.indexOf(start), endPosition),
                    startInSegment = currentSegment.slice(start.length).match(startRegExp);
                while(startInSegment && startInSegment.length > 0 && endings.length > 0) {
                    end = endings.shift();
                    beginnings.shift();
                    startInSegment.shift();
                    currentSegment += restOfString.slice(0,restOfString.indexOf(end)+end.length);
                    restOfString = restOfString.slice(restOfString.indexOf(end)+end.length);
                }
                segment = restOfString;
                arrayOfMatches.push(currentSegment);
                if(startInSegment){
                    endPosition = currentSegment.lastIndexOf(end);
                    searchForStatementMatches(currentSegment.slice(start.length,endPosition), statementType, arrayOfMatches);
                }
            }
        }
        return arrayOfMatches;
    }
    function parseStatements(segment){
        let statements = {};
        presetStatements.forEach(function(statement){
            let statementMatches = searchForStatementMatches(segment, statement);
            if(!statementMatches) return;
            if(!statements[statement]) statements[statement] = [];
            statementMatches.forEach(function(snippet){
                var parts = snippet.match(new RegExp('\{\{\\s*'+statement+'\\s+(!?[\\w|\\s]+)+\\s*}}'));
                statements[statement].push({
                    type : statement,
                    snippet : snippet,
                    condition : parts[1].trim(),
                });
            });
        });
        return statements;
    }
    function replaceVariable(snippet, data, template){
        return template.replace(snippet, data);
    }``
    function processIfStatement(statements, data, template){
        statements['if'].forEach(function (operatorCase) {
            let equalsToFalse = ['false', '0'],
                condition = operatorCase.condition,
                replacePattern = '',
                checkedCondition,
                isNegative = condition.charAt(0) === '!';
            if (isNegative) {
                condition = condition.slice(1);
                checkedCondition = !data[condition] || checkIfInSet(equalsToFalse, data[condition]);
            } else {
                checkedCondition = data[condition] && !checkIfInSet(equalsToFalse, data[condition]);
            }
            if (checkedCondition) {
                replacePattern = operatorCase.snippet.replace(/(^\{\{if[^}]*}})|(\{\{\/\s*if\s*}}$)/g, '');
            }
            template = replaceVariable(operatorCase.snippet, replacePattern, template);
        });
        return template;
    }
    function processRepeatStatement(statements, data, template){
        statements['repeat'].forEach(function (operatorCase) {
            let parts = operatorCase.condition.split('as');
            if (!parts || parts.length < 2) return;
            let set = data[parts[0].trim()],
                setKeys = Object.keys(set),
                variable = parts[1].trim(),
                replacePattern = '',
                repeatedPart = operatorCase.snippet.replace(/(^{{[^{]*}})|({{[^{]*}}$)/g, '').trim(),
                snippetVariables = parseSegments(repeatedPart);
            setKeys.forEach(function (key) {
                let currentItem = set[key],
                    replacePiece = repeatedPart;
                snippetVariables.forEach(function (varCase) {
                    let currentStep = undefined,
                        variableParts = varCase.fullName.trim().split('.');
                    if(variableParts.shift() !== variable) return;
                    while (variableParts.length > 0) {
                        currentStep = currentItem[variableParts.shift()];
                        if (variableParts.length === 0 && currentStep !== undefined) {
                            replacePiece = replaceVariable(varCase.content, String(currentStep), replacePiece);
                        }
                    }
                });
                replacePattern += replacePiece;
            });
            template = replaceVariable(operatorCase.snippet, replacePattern, template);
        });
        return template;
    }
    function fillTemplate(inputData){
        let tStatements = inputData._templateStatements,
            tVars = inputData._templateVariables,
            tData = inputData._templateData,
            template = inputData._content;
        if('if' in tStatements){
            template = processIfStatement(tStatements, inputData, template);
        }
        tVars.forEach(function(variable){
            let name = variable.name,
                value = inputData[name];
            template = replaceVariable(variable.content, value, template);
        });
        tData.forEach(function(templ){
            let name = templ.name,
                value = inputData[name];
            template = replaceVariable(templ.content, fillTemplate(value), template);
        });
        return template;
    }
    function getLocalObject(path){
        let pathParts = path.split('*'),
            currentObject = engine._data.fullTemplateData;
        pathParts.forEach(function(part){
            if(part) {
                if(!currentObject[part]) {
                    currentObject[part] = {}
                }
                currentObject = currentObject[part];
            }
        });
        return currentObject;
    }
    engine.render = function(templatePath, elementToRender, dataObject, callback, currentPath){
        loadTemplate(templatePath,function(template){
            dataObject._templateVariables = [];
            dataObject._templateData = [];
            dataObject._templateStatements = parseStatements(template);
            if('repeat' in dataObject._templateStatements){
                template = processRepeatStatement(dataObject._templateStatements, dataObject, template);
                dataObject._templateStatements = parseStatements(template);
            }
            dataObject._content = template;
            let segments = parseSegments(template),
                data = engine._data;
            segments.forEach(function(segment){
                let parameterKeys = Object.keys(segment.parameters);
                if(parameterKeys.length !== 0 ){
                    if(!dataObject[segment.name] && isTemplate(segment.fullName)) dataObject[segment.name] = {};
                    else if(!dataObject[segment.name])dataObject[segment.name] = "";
                    parameterKeys.forEach(function(key){
                        if(!inPresetValues(key)){
                            if(key === 'default' && !dataObject[segment.name]){
                                dataObject[segment.name] = segment.parameters[key];
                            } else {
                                dataObject[segment.name][key] = segment.parameters[key];
                            }
                        }
                    });
                }
                if(isTemplate(segment.fullName)){
                    data.templateLine.push({
                        relativeObjectPath : (currentPath || '') +'*'+segment.name,
                        data : segment
                    });
                    dataObject._templateData.push(segment);
                } else {
                    dataObject._templateVariables.push(segment);
                }
            });
            if(data.templateLine.length === 0){
                let readyTempalte = fillTemplate(data.fullTemplateData);
                if(engine._data.root){
                    engine._data.root.html ? engine._data.root.html(readyTempalte) : $(engine._data.root).html(readyTempalte);
                }
                if(callback){
                    callback(readyTempalte);
                }

            } else {
                let templateToRender = data.templateLine.shift(),
                    templateData = templateToRender.data,
                    name = templateData.name,
                    type = templateData.parameters.type,
                    objectPath = templateToRender.relativeObjectPath,
                    currentObjectToFill = getLocalObject(objectPath);
                engine.render(buildTemplateLink(name,type),elementToRender,currentObjectToFill,callback, objectPath);
            }
        });
    };
    engine.init = function(inputData){
        let rootElement = $('[page-template]'),
            pageTemplate = rootElement.attr('page-template'),
            data = engine._data;
        data.fullTemplateData = inputData || {};
        engine._data.root = rootElement;
        engine.render(buildTemplateLink(pageTemplate, 'page'), rootElement, data.fullTemplateData);
    };
    return engine;
})