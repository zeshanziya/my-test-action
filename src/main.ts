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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    core.info(
      `info - ${github.context.ref} - ${github.context.payload} - ${tempText.join()}`
    )

    const { GITHUB_REF_NAME } = process.env

    // Set outputs for other workflow steps to use
    core.setOutput('time', `${new Date().toTimeString()} - ${GITHUB_REF_NAME}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
