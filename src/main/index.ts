import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import {
  installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  allContents,
  evaluateChip,
  getExactLocation,
  getOutputs,
  isCompiled,
  makeCompiledTrue,
  saveToFile,
  writeChipFileContents
} from './helper'
import fs from 'fs'
import prompt from 'electron-prompt'
import { Content, FileData } from '../types/filedata'
// import { execSync } from 'child_process'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', (e) => {
    // e.preventDefault()
    if (mainWindow) {
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Cancel', 'Quit'],
        defaultId: 0,
        title: 'Confirm',
        message: 'Some content may not have been saved. Are you sure you want to quit?'
      })

      if (choice === 0) {
        e.preventDefault()
      }
    } else {
      e.preventDefault()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
    .then(([redux, react]) => console.log(`Added Extensions:  ${redux.name}, ${react.name}`))
    .catch((err) => console.log('An error occurred: ', err))

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  ipcMain.handle('dialog:openDirectory', async (_, path?: string) => {
    if (mainWindow) {
      try {
        console.log('req path : ', path)
        const defaultPath = path || '/home/chiru/Desktop/'

        const result = await dialog.showOpenDialog(mainWindow, {
          properties: ['openDirectory'],
          defaultPath: defaultPath
        })

        console.log('res : ', result)

        if (result.canceled || result.filePaths.length == 0) {
          return {
            path: '',
            content: []
          }
        }

        const directoryPath = result.filePaths[0]

        // Recursively get all child files and folders
        const allFiles = await allContents(directoryPath)

        return {
          path: directoryPath,
          content: allFiles
        }
      } catch (error) {
        console.error('Error opening directory:', error)
        if (error instanceof Error) {
          dialog.showErrorBox(
            'Folder Opening Error',
            `An error occurred while opening the folder: ${error?.message}`
          )
        }
        return {
          path: '',
          content: []
        }
      }
    }
    return {
      path: '',
      content: []
    }
  })

  ipcMain.handle('dialog:showSaveDialog', async (_, defaultPath) => {
    if (mainWindow) {
      try {
        const result = await dialog.showSaveDialog(mainWindow, {
          title: 'Create new File',
          defaultPath,
          filters: [{ name: 'Supported Files', extensions: ['chip'] }]
        })

        if (!result.canceled && result.filePath) {
          let filePath = result.filePath

          // Ensure the file has a .chip extension
          if (!filePath.endsWith('.chip')) {
            filePath += '.chip'
          }
          const fileName = path.basename(filePath)
          fs.writeFileSync(filePath, writeChipFileContents(fileName, filePath))
          console.log('File created:', filePath)
        }
      } catch (error) {
        if (error instanceof Error) {
          dialog.showErrorBox(
            'File Creation Error',
            `An error occurred while creating the file: ${error.message}`
          )
        }
        console.error('Error while creating new file:', error)
      }
    }
  })

  ipcMain.handle('dialog:getAllFiles', async (_, defaultPath) => {
    try {
      const allFiles = await allContents(defaultPath)
      return {
        path: '',
        content: allFiles
      }
    } catch (error) {
      alert('couldnt get all contents....')

      if (error instanceof Error) {
        dialog.showErrorBox(
          'Get All Files Error',
          `An error occurred while fetching all the files: ${error?.message}`
        )
      }

      console.log('error : ', error)
      return {
        path: '',
        content: []
      }
    }
  })

  ipcMain.handle('dialog:createFolder', async (_, pathName?: string, folderName?: string) => {
    if (!mainWindow) return { success: false, message: 'Main window not available' }
    if (!pathName || !folderName) return { success: false, message: 'Invalid path or folder name' }

    try {
      const folderPath = path.join(pathName, folderName)

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
        return { success: true, message: 'Folder created successfully' }
      } else {
        return { success: false, message: 'Folder already exists' }
      }
    } catch (error) {
      console.error('Error creating folder:', error)

      if (error instanceof Error) {
        dialog.showErrorBox(
          'Folder Creation Error',
          `An error occurred while creating the folder: ${error.message}`
        )
      }
      return { success: false, message: 'Error while creating folder' }
    }
  })

  ipcMain.handle('show-prompt', async () => {
    const result = await prompt({
      title: 'Create New Folder',
      label: 'Enter folder name:',
      value: '',
      inputAttrs: {
        type: 'text'
      },
      type: 'input'
    })

    return result
  })

  ipcMain.handle('saved', async () => {
    console.log('saved bro... chill')
  })

  ipcMain.handle('saveChipContents', async (_, path: string, chipContents: Content[]) => {
    try {
      await saveToFile(path, chipContents)
      return true // indicating succes
    } catch (error) {
      dialog.showErrorBox(' Saving File Contents Error', 'Error while saving file contents')
      console.log('error : ', error)
      return false
    }
  })

  ipcMain.handle('getCustomChips', async (_, pathOfFile: string) => {
    const folderPath = path.dirname(pathOfFile)
    const currentFile = path.basename(pathOfFile)

    // Get all contents of the directory
    const allContentsOfDir = await allContents(folderPath)

    // Map over contents and filter asynchronously
    const filteredContents = await Promise.all(
      allContentsOfDir.map(async (con) => {
        if (!con.isFolder && con.name.endsWith('.chip') && con.name !== currentFile) {
          const compiled = await isCompiled(con.path)
          return compiled ? con : null
        }
        return null
      })
    )

    // Remove null values
    return filteredContents.filter(Boolean)
  })

  ipcMain.handle('retrieveContentofFile', async (_, filePath: string, cwd: string) => {
    try {
      const data = fs.readFileSync(filePath, 'utf-8')
      const fileInfo: FileData = JSON.parse(data)
      if (cwd !== '') {
        fileInfo.location = getExactLocation(filePath, cwd)
      }
      return fileInfo
    } catch (error) {
      dialog.showErrorBox('Open File Error', 'Error while opening file...')
      console.error('Error:', error)

      return { error: 'Failed to read file' }
    }
  })

  ipcMain.handle('evaluateChip', async (_, name: string, chips: Content[]) => {
    try {
      const obj = evaluateChip(name, chips)
      return { class: obj.classBody, inputs: obj.inputs }
    } catch (error) {
      dialog.showErrorBox('Evaluation Error', (error as Error).message)
      console.error('Error evaluating chip:', error)
      return { error: (error as Error).message }
    }
  })

  ipcMain.handle(
    'saveCompileFiles',
    async (_, cwd: string, pathOfFile: string, classBody: string) => {
      try {
        const pof = pathOfFile
        let dotChipFolderPath = path.join(cwd, '.chips')
        if (!fs.existsSync(dotChipFolderPath)) {
          fs.mkdirSync(dotChipFolderPath, { recursive: true })
        }

        const relativePath = pathOfFile.replace(cwd, '').split(path.sep).filter(Boolean) // ["someFolder", "and.chip"]

        let currentPath = dotChipFolderPath

        for (let folderOrFile of relativePath) {
          if (folderOrFile.endsWith('.chip')) {
            const jsFileName = folderOrFile.replace('.chip', '.mjs') // Change to .js
            currentPath = path.join(currentPath, jsFileName)
          } else {
            currentPath = path.join(currentPath, folderOrFile)
            if (!fs.existsSync(currentPath)) {
              fs.mkdirSync(currentPath, { recursive: true })
            }
          }
        }

        fs.writeFileSync(currentPath, classBody, 'utf8')

        console.log('✅ JavaScript file created successfully at:', currentPath)
        await makeCompiledTrue(pof)

        return { success: true, path: currentPath }
      } catch (error) {
        dialog.showErrorBox('File creation Error', (error as Error).message)
        console.error('❌ Error saving file:', error)
        return { success: false, error: (error as Error).message }
      }
    }
  )

  ipcMain.handle('getOutputsOfChip', async (_, filePath: string, inputs: Map<string, boolean>) => {
    try {
      const result = await getOutputs(filePath, inputs)
      if (!result) {
        return { error: 'Failed to compute outputs' }
      }
      return { outputs: result }
    } catch (error) {
      dialog.showErrorBox('Outputs Error', (error as Error).message)
      console.error('❌ Error computing outputs:', error)
      return { error: 'Failed to compute outputs' }
    }
  })

  ipcMain.handle('getDetailsofCustomChip', async (_, cwd: string, filePath: string) => {
    const compileFilePath = filePath.split(cwd).join('')
    const completeCompiledFilePath = path.join(cwd, '.chips', compileFilePath)

    console.log(completeCompiledFilePath)
  })

  ipcMain.handle('getChipFromDiffrentPlace', async (_, currentPath) => {
    try {
      if (!mainWindow) return { success: false, error: 'No main window found' }

      const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select a .chip file',
        buttonLabel: 'Choose File',
        properties: ['openFile'],
        filters: [{ name: 'Chip Files', extensions: ['chip'] }]
      })

      if (!result.canceled && result.filePaths.length > 0) {
        const currDirPath = path.dirname(currentPath)
        const selectedFilePath = result.filePaths[0]
        const selectedDirPath = path.dirname(selectedFilePath)

        if (currDirPath !== selectedDirPath) {
          return { success: true, path: selectedFilePath }
        } else {
          return { success: false, reason: 'File is in the same directory' }
        }
      }

      return { success: false, reason: 'No file selected' }
    } catch (error) {
      console.error('Error: ', error)
      return { success: false, error: (error as Error).message }
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
