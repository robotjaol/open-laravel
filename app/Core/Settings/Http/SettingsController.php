<?php

namespace App\Core\Settings\Http;

use App\Core\Audit\AuditLogger;
use App\Core\Settings\SettingsService;
use App\Shared\Support\Options;
use DateTimeZone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(Request $request, SettingsService $settings): Response
    {
        abort_unless($request->user()->can('settings.view'), 403);

        $all = $settings->all();

        return Inertia::render('settings/application', [
            'settings' => [
                'app_name' => (string) $all['app_name'],
                'timezone' => (string) $all['timezone'],
                'locale' => (string) $all['locale'],
                'registration_enabled' => (bool) $all['registration_enabled'],
                'audit_retention_days' => (int) $all['audit_retention_days'],
            ],
            'timezones' => collect(DateTimeZone::listIdentifiers())->map(fn (string $z): array => ['value' => $z, 'label' => $z])->all(),
            'locales' => collect((array) config('settings.locales'))->map(fn (string $label, string $code): array => ['value' => $code, 'label' => $label])->values()->all(),
            'canUpdate' => $request->user()->can('settings.update'),
        ]);
    }

    public function update(Request $request, SettingsService $settings, AuditLogger $audit): RedirectResponse
    {
        abort_unless($request->user()->can('settings.update'), 403);

        $data = $request->validate([
            'app_name' => ['required', 'string', 'max:80'],
            'timezone' => ['required', 'string', Rule::in(DateTimeZone::listIdentifiers())],
            'locale' => ['required', 'string', Rule::in(array_keys((array) config('settings.locales')))],
            'registration_enabled' => ['required', 'boolean'],
            'audit_retention_days' => ['required', 'integer', 'min:30', 'max:3650'],
        ]);

        $before = $settings->all();
        $settings->set($data, $request->user()->id);

        $changed = array_keys(array_filter($data, fn ($v, $k) => $before[$k] !== $v, ARRAY_FILTER_USE_BOTH));
        $audit->log('settings.updated', 'Application settings updated', null, ['changed' => $changed]);

        return back()->with('success', 'Settings saved.');
    }
}
