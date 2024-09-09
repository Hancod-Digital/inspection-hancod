'use client' 
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardHeader } from '@mui/material'

export default function Component() {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <Card className="w-full bg-[#fafbfb] p-0 rounded-none border-0 mx-auto">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
            <TabsTrigger
              value="personal"
              className={activeTab === "personal" ? "bg-[#8B1F41] text-white" : ""}
            >
              Personal Details
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className={activeTab === "password" ? "bg-[#8B1F41] text-white" : ""}
            >
              Change Password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="space-y-6 bg-white py-10">
            <div className="flex space-x-8">
              <div className="flex flex-col items-center min-w-[30%]">
                <Avatar className="w-4/6 h-[88%] mb-2">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile picture" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Button variant="link" className="text-[#8B1F41]">Upload Image</Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex space-x-2">
                    <Select defaultValue="+91">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">+91</SelectItem>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input id="mobile" type="tel" placeholder="Enter your mobile number" className="flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="space-y-4 max-w-md">
                <h2 className='font-bold text-xl'>New Password</h2>
               <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" className="border-[#8B1F41] text-[#8B1F41]">Cancel</Button>
          <Button className="bg-[#8B1F41] text-white hover:bg-[#6B1732]">Save</Button>
        </div>
      </CardContent>
    </Card>
  )
}