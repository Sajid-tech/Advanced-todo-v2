import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserProfile from "./UserProfile";
import { primaryNavItems } from "@/utils";
import React from "react";

// sajid

const Sidebar = () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <UserProfile />
        </div>
        <div>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {primaryNavItems.map(({ name, icon, link }, id) => (
              <Link
                key={id}
                href={link}
                className="flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary"
              >
                {icon}
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>About</CardTitle>
              <CardDescription>
                Todovex is a robust task management application designed to
                streamline your productivity workflow.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
