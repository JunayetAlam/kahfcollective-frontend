'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Users, Clock, BookOpen, Star, Eye, Heart } from "lucide-react"
import AD_Chart from "./AD_Chart"
import { Badge } from "../ui/badge"


export default function AD_BottomComponents() {
    const alerts = ['3 instructor applications pending', '15 Reports', '2 refund requests'];

const userDestributions = [
    {title: 'Awaken Tier', users: 567},
    {title: 'Ascend Tier', users: 231},
    {title: 'Actualize Tier', users: 222},
]

    return (
        <div className="pb-10 space-y-8">
            <AD_Chart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">System Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>

                        <div className="space-y-3">
                            {
                                alerts?.map((item, index) => <div
                                    key={index}
                                    className="flex justify-between h-12">
                                    <div className="flex gap-3  items-center">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <p className="font-medium">{item}</p>
                                    </div>
                                    <Button>
                                        Review
                                    </Button>
                                </div>)
                            }

                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>

                        <div className="space-y-3">
                            {
                                userDestributions?.map((item, index) => <div
                                    key={index}
                                    className="flex justify-between items-center border border-border  px-2.5 h-12 rounded-md">
                                    <p className="font-medium">{item.title}</p>
                                  <Badge variant={"outline"} >{item.users} users</Badge>
                                </div>)
                            }

                        </div>
                    </CardContent>
                </Card>

 {/* User Activity Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                User Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Daily Active Users</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">456</div>
                    <div className="text-xs text-green-600">+12%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Weekly Retention</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-xs text-green-600">+12%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Avg Session Time</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">24 min</div>
                    <div className="text-xs text-green-600">+15%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Course Completion</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-xs text-green-600">+12%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Courses Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Top Performing Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Foundations of Faith</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>240</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>240</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>240</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={50} className="flex-1" />
                    <span className="text-sm font-medium">50%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Completion Rate</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">The Prophetic Path</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>210</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>210</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>210</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={50} className="flex-1" />
                    <span className="text-sm font-medium">50%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Completion Rate</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Islamic Jurisprudence</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>240</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>240</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>240</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={50} className="flex-1" />
                    <span className="text-sm font-medium">50%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
        </div>
    )
}
