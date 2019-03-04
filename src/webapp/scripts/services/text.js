const _public = {};

_public.removeBlankFirstLine = text => {
  const lines = text.split('\n');
  if(hasMoreThanOneLine(lines) && isFirstLineEmpy(lines))
    lines.splice(0,1);
  return lines.join('\n');
};

_public.normalizeIndentation = code => {
  const textLines = _public.removeBlankFirstLine(code);
  const numOfSpaces = countLeadingSpaces(textLines);
  const regex = new RegExp(`^[\\s]{${numOfSpaces}}`, 'g');
  return textLines.split('\n').map(line => {
    return line.replace(regex, '');
  }).join('\n');
};

function hasMoreThanOneLine(lines){
  return lines.length > 1;
}

function isFirstLineEmpy(lines){
  return lines[0].trim() === '';
}

function countLeadingSpaces(textLines){
  const leadingSpaces = textLines.split('\n')[0].match(/^[\s]+/g);
  return leadingSpaces && leadingSpaces.length ? leadingSpaces[0].length : 0;
}

export default _public;
