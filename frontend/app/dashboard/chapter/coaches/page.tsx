'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Plus, Check, X, User } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function ChapterCoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()
  
  const [newCoach, setNewCoach] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    certification_level: 'SALC',
    certification_date: new Date().toISOString(),
    chapter_id: '', // Will be set from logged in user
  })

  const loadCoaches = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const res = await api.coaches.list({ 
        chapter_id: user.chapter_id,
        page_size: 100 
      })
      setCoaches(res.data)
    } catch (err) {
      toast({ title: 'Error loading coaches', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoaches()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await api.coaches.create({
        ...newCoach,
        chapter_id: user.chapter_id
      })
      toast({ title: 'Coach added! Awaiting final approval.' })
      setIsCreating(false)
      loadCoaches()
    } catch (err: any) {
      toast({ title: 'Failed to add coach', description: err.message, variant: 'destructive' })
    }
  }

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await api.coaches.approve(id, approved)
      toast({ title: approved ? 'Coach approved and published' : 'Coach hidden' })
      loadCoaches()
    } catch (err) {
      toast({ title: 'Approval action failed', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Local Chapter Coaches</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Coach
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Local Coach</DialogTitle>
              <DialogDescription>
                Add a certified Action Learning coach to your chapter.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={newCoach.first_name} onChange={e => setNewCoach({...newCoach, first_name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={newCoach.last_name} onChange={e => setNewCoach({...newCoach, last_name: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={newCoach.email} onChange={e => setNewCoach({...newCoach, email: e.target.value})} type="email" required />
              </div>
              <div className="space-y-2">
                <Label>Certification Level</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={newCoach.certification_level}
                  onChange={e => setNewCoach({...newCoach, certification_level: e.target.value})}
                >
                  <option value="SALC">SALC</option>
                  <option value="CALC">CALC</option>
                  <option value="PALC">PALC</option>
                  <option value="MALC">MALC</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit">Add Coach</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {coaches.length === 0 && !loading && (
          <Card className="p-12 text-center text-muted-foreground">
            No coaches registered in your chapter yet.
          </Card>
        )}
        {coaches.map((coach) => (
          <Card key={coach.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{coach.first_name} {coach.last_name}</h3>
                  <p className="text-sm text-muted-foreground">{coach.certification_level} • {coach.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={coach.is_approved ? 'default' : 'secondary'}>
                  {coach.is_approved ? 'Published' : 'Pending Approval'}
                </Badge>
                {!coach.is_approved ? (
                  <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApprove(coach.id, true)}>
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleApprove(coach.id, false)}>
                    <X className="h-4 w-4 mr-1" /> Unpublish
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
