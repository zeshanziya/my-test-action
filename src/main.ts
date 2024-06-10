import * as core from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import * as github from '@actions/github'
import { wait } from './wait'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    const tempText: Buffer[] = []
    const options: ExecOptions = {
      listeners: {
        stdout: data => {
          tempText.push(data)
        }
      }
    }

    await exec(`${__dirname}/../script/test.sh`, [], options)

    core.info(
      `info - ${github.context.ref} = ${github.context.payload} - ${tempText.join()}`
    )

    const { MY_CUSTOM_ENV } = process.env

    // Set outputs for other workflow steps to use
    core.setOutput('time', `${new Date().toTimeString()} - ${MY_CUSTOM_ENV}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
