const aws  = require('aws-sdk')
const clui = require('clui')
const yaml = require ('js-yaml')
const fs   = require ('fs')

aws.config.update({region:'ap-northeast-1'})
const cloudformation = new aws.CloudFormation()
const creatingSpinner = new clui.Spinner('Creating stack ...', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'])
const deletingSpinner = new clui.Spinner('Deleting stack ...', ['⣷', '⣯', '⣟', '⡿', '⢿', '⣻', '⣽', '⣾'])

let filepath = process.argv[2]

if (filepath === undefined) {
  console.error('Template filepath is required.\n')
  process.exit(1)
}

let stacks = loadStacksConfig(filepath)
let createdStackCount = 0

creationProcess()
.catch((error) => {
  console.error("Create failed.")
  console.error('  ERROR CODE   : ', error.code)
  console.error('  ERROR MESSAGE: ', error.message, "\n")

  deletionProcess()
})

// functions

async function creationProcess () {
  for (let i = 0; i < stacks.length; i++) {
    let stackData = await cloudformation.createStack(stacks[i]).promise()
    .catch(error => { return Promise.reject(error) })

    createdStackCount++
    stacks[i]['StackId'] = stackData.StackId
    creatingSpinner.start()
    await cloudformation.waitFor('stackCreateComplete', {StackName: stackData.StackId}).promise()
    .catch(error => {
      creatingSpinner.stop()
      return Promise.reject(error)
    })

    creatingSpinner.stop()
    console.log("Create complete: ", stackData.StackId, "\n")
  }
}

async function deletionProcess () {
  for (; createdStackCount > 0; createdStackCount--) {
    let process = await cloudformation.deleteStack({StackName: stacks[createdStackCount - 1]['StackId']}).promise()
    .catch(error => {
      console.error(error)
      process.exit(1)
    })

    deletingSpinner.start()
    await cloudformation.waitFor('stackDeleteComplete', {StackName: stacks[createdStackCount - 1]['StackId']}).promise()
    .catch(error => {
      deletingSpinner.stop()
      console.error(error)
      process.exit(1)
    })

    deletingSpinner.stop()
    console.log("Delete complete: ", stacks[createdStackCount - 1]['StackId'], "\n")
  }
}

function loadStacksConfig (filepath) {
  try {
    let doc = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'))
    return doc['Stacks']
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}