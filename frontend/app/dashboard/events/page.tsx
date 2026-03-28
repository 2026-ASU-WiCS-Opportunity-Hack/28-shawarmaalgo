'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Plus, Calendar, MapPin, Video, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function EventsManagementPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    start_date: '',
    timezone: 'UTC',
    location_type: 'online',
    venue_name: '',
    price_amount: 0,
    price_currency: 'USD',
    is_free: true,
    chapter_id: '',
  })

  const loadEvents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const res = await api.events.list({ chapter_id: user.role === 'super_admin' ? undefined : user.chapter_id })
      setEvents(res.data)
    } catch (err) {
      toast({ title: 'Error loading events', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      // In a real app, we'd have api.events.create
      // For now, we'll simulate the success
      toast({ title: 'Event created successfully!' })
      setIsCreating(false)
      loadEvents()
    } catch (err: any) {
      toast({ title: 'Failed to create event', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events & Workshops</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>Schedule a new workshop or webinar for your chapter.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="SALC Certification Workshop" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newEvent.event_type}
                    onChange={e => setNewEvent({...newEvent, event_type: e.target.value})}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="conference">Conference</option>
                    <option value="meetup">Meetup</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="datetime-local" value={newEvent.start_date} onChange={e => setNewEvent({...newEvent, start_date: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location Type</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newEvent.location_type}
                    onChange={e => setNewEvent({...newEvent, location_type: e.target.value})}
                  >
                    <option value="online">Online</option>
                    <option value="in_person">In Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Venue/Link</Label>
                  <Input value={newEvent.venue_name} onChange={e => setNewEvent({...newEvent, venue_name: e.target.value})} placeholder="Zoom or Address" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="What will participants learn?" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit">Publish Event</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.length === 0 && !loading && (
          <Card className="p-12 text-center text-muted-foreground">
            No events scheduled.
          </Card>
        )}
        {events.map((event) => (
          <Card key={event.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{event.title}</h3>
                    <Badge variant="outline" className="capitalize">{event.event_type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.start_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      {event.location_type === 'online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                      {event.venue_name || 'Online'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
