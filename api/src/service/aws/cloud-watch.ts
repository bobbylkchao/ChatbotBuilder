import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
  DescribeLogStreamsCommand,
} from '@aws-sdk/client-cloudwatch-logs'
import logger from '../../misc/logger'

export const sendLogsToCloudwatch = async (logs: object) => {
  if (
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  ) {
    try {
      const cloudWatchLogs = new CloudWatchLogsClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })

      const describeResponse = await cloudWatchLogs.send(
        new DescribeLogStreamsCommand({
          logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP_NAME,
          logStreamNamePrefix: process.env.AWS_CLOUDWATCH_LOG_STREAM_NAME,
        })
      )

      const logStream = describeResponse.logStreams?.find(
        (stream) =>
          stream.logStreamName === process.env.AWS_CLOUDWATCH_LOG_STREAM_NAME
      )

      const sequenceToken = logStream?.uploadSequenceToken

      await cloudWatchLogs.send(
        new PutLogEventsCommand({
          logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP_NAME,
          logStreamName: process.env.AWS_CLOUDWATCH_LOG_STREAM_NAME,
          logEvents: [
            {
              message: JSON.stringify(logs, null, 2),
              timestamp: Date.now(),
            },
          ],
          sequenceToken,
        })
      )
    } catch (err) {
      logger.error(err, 'Send logs to CloudWatch failed')
    }
  }
}
