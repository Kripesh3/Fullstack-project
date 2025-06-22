<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Ticket - {{ $event->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .ticket-info {
            padding: 30px;
        }
        .ticket-details {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-label {
            font-weight: bold;
            color: #555;
        }
        .detail-value {
            color: #333;
        }
        .ticket-number {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .qr-section {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            margin: 20px 0;
        }
        .instructions {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎫 Event Ticket</h1>
            <p>Your ticket is ready!</p>
        </div>
        
        <div class="ticket-info">
            <h2>Hello {{ $user->name }}!</h2>
            <p>Thank you for registering for <strong>{{ $event->title }}</strong>. Your ticket has been generated successfully.</p>
            
            <div class="ticket-number">
                TICKET #{{ $ticketId }}
            </div>
            
            <div class="ticket-details">
                <h3>📅 Event Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Event:</span>
                    <span class="detail-value">{{ $event->title }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($event->start_date)->format('F j, Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($event->start_date)->format('g:i A') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">{{ $event->location ?? 'TBA' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Attendee:</span>
                    <span class="detail-value">{{ $user->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{{ $user->email }}</span>
                </div>
            </div>
            
            <div class="qr-section">
                <h3>📱 QR Code Ticket</h3>
                <p>Your QR code ticket is attached to this email. Please save it to your device and present it at the event entrance.</p>
                <p><strong>Filename:</strong> event-ticket.png</p>
            </div>
            
            <div class="instructions">
                <h4>📋 Important Instructions:</h4>
                <ul style="text-align: left; margin: 10px 0;">
                    <li>Save the QR code image to your phone or print it out</li>
                    <li>Present this ticket at the event entrance for scanning</li>
                    <li>Arrive 15-30 minutes before the event starts</li>
                    <li>This ticket is non-transferable and valid for one person only</li>
                    <li>Contact us if you have any questions about the event</li>
                </ul>
            </div>
            
            @if($event->description)
            <div class="ticket-details">
                <h3>📝 Event Description</h3>
                <p>{{ $event->description }}</p>
            </div>
            @endif
        </div>
        
        <div class="footer">
            <p>Thank you for choosing EventEase!</p>
            <p>If you have any questions, please contact us at admin@eventease.com</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                This is an automated email. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
