'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiTwitterXFill } from 'react-icons/ri';
import { AiFillLinkedin } from 'react-icons/ai';
import Link from 'next/link';
import TwitterAccountStatus from "./twitterAccountStatus";
import TwitterProfileCard from "../TwitterProfileCard";

export default function SocialAccountsSidebar() {
  return (
    <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 mx-auto p-6">
      {/* Twitter / X Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <RiTwitterXFill className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Connect
              </p>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
                Twitter / X
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Connect your Twitter account to share tweets directly from our app
            and grow your audience.
          </p>
          <TwitterAccountStatus />
        </CardContent>
      </Card>

      {/* LinkedIn Section */}
      <Card className="group relative overflow-hidden transition-all hover:border-muted-foreground/20 hover:bg-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10">
              <AiFillLinkedin className="h-6 w-6 text-[#0A66C2]" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Connect
              </p>
              <span className="bg-gradient-to-r from-[#0A66C2] to-[#00A0DC] bg-clip-text text-xl font-bold text-transparent">
                LinkedIn
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Connect your LinkedIn to share professional updates and expand your
            network reach.
          </p>
          <Button
            variant="outline"
            className="w-full transition-all hover:scale-[1.02] hover:shadow-sm"
            asChild
          >
            <Link href="/connect/linkedin" className="gap-2">
              <AiFillLinkedin className="h-4 w-4" />
              Connect Account
              <span className="ml-1 opacity-0 transition-all group-hover:opacity-100">
                →
              </span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
