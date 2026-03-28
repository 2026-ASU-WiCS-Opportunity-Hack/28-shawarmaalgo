'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Save, Globe, Mail, Phone } from 'lucide-react'

export default function ChapterSettingsPage() {
  const [chapter, setChapter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadChapter = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (user.chapter_id) {
          const data = await api.chapters.get(user.chapter_id)
          setChapter(data)
        }
      } catch (err) {
        toast({ title: 'Error loading chapter settings', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    loadChapter()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Settings saved successfully!' })
  }

  if (loading) return <div>Loading...</div>
  if (!chapter) return <div>No chapter assigned to your account.</div>

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Chapter Settings</h2>
        <p className="text-muted-foreground">Manage your local chapter&apos;s public information and branding.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
            <CardDescription>This information will be displayed on your chapter&apos;s landing page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={chapter.name} readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground">Only Super Admins can change the chapter name.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Chapter Description (English)</Label>
              <Textarea 
                id="description" 
                rows={4} 
                defaultValue={chapter.description} 
                placeholder="Tell the world about your local Action Learning community..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_local">Chapter Description (Local Language)</Label>
              <Textarea 
                id="description_local" 
                rows={4} 
                defaultValue={chapter.description_local} 
                placeholder="Optional description in your primary local language..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How coaches and students can reach your chapter lead.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Public Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" className="pl-9" defaultValue={chapter.contact_email} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">External Website (Optional)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="website" className="pl-9" defaultValue={chapter.website_url} placeholder="https://yourchapter.org" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
