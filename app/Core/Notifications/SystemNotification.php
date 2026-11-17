<?php

namespace App\Core\Notifications;

use Illuminate\Notifications\Notification;

/** Generic in-app notification. Modules may send this or define their own database notification. */
class SystemNotification extends Notification
{
    public function __construct(private readonly string $title, private readonly string $body) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, string>
     */
    public function toArray(object $notifiable): array
    {
        return ['title' => $this->title, 'body' => $this->body];
    }
}
