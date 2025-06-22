@component('mail::message')
# Your Event Ticket

Here's your QR code for {{ $event->title }}

{!! $qrCode !!}

**Event Details:**
Date: {{ $event->date }}
Venue: {{ $event->location }}

Thanks,
{{ config('app.name') }}
@endcomponent