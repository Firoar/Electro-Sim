export const getFileContent = async (selectedFile: string) => {
  const allContofFiles = await window.electron.retrieveContentofFile(selectedFile)
  return allContofFiles
}
