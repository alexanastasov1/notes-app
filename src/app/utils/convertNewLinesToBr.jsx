export const convertNewlinesToBr = (text) => {
  return text.split('\n').map((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) {
      return null;
    }
    return (
      <span key={index}>
        {trimmedLine}
        <br/>
      </span>
    );
  }).filter(line => line !== null);
};
