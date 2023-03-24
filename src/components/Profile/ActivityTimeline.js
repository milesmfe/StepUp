import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Typography } from "@mui/material";

export default function ActivityTimeline({ activityData }) {
  return (
    <Timeline position="alternate">
      {activityData ? (
        activityData.map((activity, i) => {
          return (
            <TimelineItem key={i}>
              <TimelineOppositeContent
                sx={{ m: "auto 0", textJustify: "center" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {activity.time.split("T")[0]}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>{activity.title}</TimelineContent>
            </TimelineItem>
          );
        })
      ) : (
        <Typography variant="body1">Nothing to see here...</Typography>
      )}
    </Timeline>
  );
}
