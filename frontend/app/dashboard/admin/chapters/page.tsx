'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Plus, Sparkles, Check, X, Globe } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const { toast } = useToast()

  const [newChapter, setNewChapter] = useState({
    name: '',
    slug: '',
    country: '',
    region: 'Global',
    primary_language: 'en',
    supported_languages: ['en'],
    timezone: 'UTC',
    currency: 'USD',
    contact_email: '',
  })

  const loadChapters = async () => {
    try {
      const res = await api.chapters.list()
      setChapters(res.data)
    } catch (err) {
      toast({ title: 'Error loading chapters', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChapters()
  }, [])

  const handleAiGenerate = async () => {
    if (!newChapter.name || !newChapter.country) {
      toast({ title: 'Please provide name and country first' })
      return
    }
    setAiLoading(true)
    try {
      const suggestions = await api.ai.generateChapter({ name: newChapter.name, country: newChapter.country })
      setNewChapter({
        ...newChapter,
        timezone: suggestions.timezone,
        primary_language: suggestions.primary_language,
        region: suggestions.suggested_region,
        slug: newChapter.name.toLowerCase().replace(/ /g, '-'),
      })
      toast({ title: 'AI Suggestions applied!' })
    } catch (err) {
      toast({ title: 'AI simulation failed' })
    } finally {
      setAiLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.chapters.create(newChapter) // Note: need to add .create to api client if not there
      toast({ title: 'Chapter created successfully!' })
      setIsCreating(false)
      loadChapters()
    } catch (err: any) {
      toast({ title: 'Failed to create chapter', description: err.message, variant: 'destructive' })
    }
  }

  const handleApprove = async (id: string, status: 'active' | 'inactive') => {
    try {
      await api.chapters.approve(id, status)
      toast({ title: `Chapter marked as ${status}` })
      loadChapters()
    } catch (err) {
      toast({ title: 'Approval failed', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Chapters</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Chapter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Provision New Chapter</DialogTitle>
              <DialogDescription>
                Create a new WIAL affiliate site with one click.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chapter Name</Label>
                  <Input value={newChapter.name} onChange={e => setNewChapter({...newChapter, name: e.target.value})} placeholder="WIAL Japan" required />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={newChapter.country} onChange={e => setNewChapter({...newChapter, country: e.target.value})} placeholder="Japan" required />
                </div>
              </div>
              
              <Button type="button" variant="outline" className="w-full gap-2 border-primary/50 text-primary hover:bg-primary/5" onClick={handleAiGenerate} disabled={aiLoading}>
                <Sparkles className="h-4 w-4" />
                {aiLoading ? 'Thinking...' : 'One-Click AI Pre-fill'}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug (URL path)</Label>
                  <Input value={newChapter.slug} onChange={e => setNewChapter({...newChapter, slug: e.target.value})} placeholder="japan" required />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input value={newChapter.contact_email} onChange={e => setNewChapter({...newChapter, contact_email: e.target.value})} type="email" placeholder="japan@wial.org" required />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit">Create Chapter</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {chapters.length === 0 && !loading && (
          <Card className="p-12 text-center text-muted-foreground">
            No chapters found in the database.
          </Card>
        )}
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{chapter.name}</h3>
                  <p className="text-sm text-muted-foreground">{chapter.country} • /{chapter.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={chapter.status === 'active' ? 'default' : 'secondary'}>
                  {chapter.status}
                </Badge>
                {chapter.status === 'pending' && (
                  <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleApprove(chapter.id, 'active')}>
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                )}
                {chapter.status === 'active' && (
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleApprove(chapter.id, 'inactive')}>
                    <X className="h-4 w-4 mr-1" /> Deactivate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
