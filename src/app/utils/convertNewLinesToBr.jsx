export const convertNewlinesToBr = (text) => {
  return text.split('\n').map((line, index) => {
    const trimmedLine = line.trim(); // Trim leading and trailing whitespace
    if (trimmedLine.length === 0) {
      return null; // Return null for empty lines to avoid rendering unnecessary elements
    }
    return (
      <span key={index}>
        {trimmedLine}
        <br/>
      </span>
    );
  }).filter(line => line !== null); // Filter out null elements (empty lines)
};
