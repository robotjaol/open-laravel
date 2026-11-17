<?php

namespace App\Core\Notifications\Http;

use App\Core\Authentication\Models\User;
use App\Shared\Support\PaginatedData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('notifications/index', [
            'notifications' => PaginatedData::make(
                $user->notifications()->latest()->paginate(15)->withQueryString(),
                fn (DatabaseNotification $n): array => [
                    'id' => $n->id,
                    'title' => (string) ($n->data['title'] ?? 'Notification'),
                    'body' => (string) ($n->data['body'] ?? ''),
                    'read_at' => $n->read_at?->toIso8601String(),
                    'created_at' => $n->created_at->toIso8601String(),
                ],
            ),
            'unread' => $user->unreadNotifications()->count(),
        ]);
    }

    public function read(Request $request, string $id): RedirectResponse
    {
        $request->user()->notifications()->whereKey($id)->firstOrFail()->markAsRead();

        return back();
    }

    public function readAll(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return back()->with('success', 'All notifications marked as read.');
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $request->user()->notifications()->whereKey($id)->firstOrFail()->delete();

        return back();
    }
}
