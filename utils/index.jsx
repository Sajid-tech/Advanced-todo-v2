import {
  Calendar,
  CalendarDays,
  Grid2X2,
  Inbox,
  Waypoints,
} from "lucide-react";

export const primaryNavItems = [
  {
    name: "Inbox",
    link: "/loggedin",
    icon: <Inbox className="w-4 h-4" />,
  },
  {
    name: "Today",
    link: "/loggedin/today",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    name: "Upcoming",
    link: "/loggedin/upcoming",
    icon: <CalendarDays className="w-4 h-4" />,
  },
  {
    name: "Filters & Labels",
    link: "/loggedin/label",
    icon: <Grid2X2 className="w-4 h-4" />,
  },
  {
    name: "Sharing",
    link: "/loggedin/sharing",
    icon: <Waypoints className="w-4 h-4" />,
  },
];
