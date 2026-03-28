'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Save, User, Linkedin, Globe, MapPin } from 'lucide-react'

export default function CoachProfilePage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast({ title: 'Profile updated successfully!' })
      setLoading(false)
    }, 1000)
  }

  if (!user) return null

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Coach Profile</h2>
        <p className="text-muted-foreground">Keep your professional information up to date for the global directory.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 border-border bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-lg">Profile Photo</CardTitle>
              <CardDescription>Upload a professional headshot</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full text-xs" type="button">Change Photo</Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Certification Level</Label>
                  <div className="h-10 px-3 flex items-center rounded-md border bg-muted text-muted-foreground">
                    MALC (Master Coach)
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Certification Date</Label>
                  <div className="h-10 px-3 flex items-center rounded-md border bg-muted text-muted-foreground">
                    June 15, 2018
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea 
                  id="bio" 
                  rows={6} 
                  placeholder="Share your experience and coaching style..."
                  defaultValue="Senior Action Learning Coach with 15+ years experience in executive leadership..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Skills & Languages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge>English</Badge>
                <Badge>Spanish</Badge>
                <Badge variant="outline" className="cursor-pointer">+ Add Language</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">Executive Coaching</Badge>
                <Badge variant="secondary">Team Transformation</Badge>
                <Badge variant="outline" className="cursor-pointer">+ Add Specialization</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="linkedin" className="pl-9" placeholder="https://linkedin.com/in/username" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Personal Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="website" className="pl-9" placeholder="https://yourcoaching.com" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
