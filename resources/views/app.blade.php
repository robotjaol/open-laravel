<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Apply the saved theme before first paint to avoid a flash. --}}
        <script @cspNonce>
            (function () {
                try {
                    var v = localStorage.getItem('appearance');
                    var dark = v === 'dark' || (v !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                    if (dark) document.documentElement.classList.add('dark');
                } catch (e) {}
            })();
        </script>

        <x-inertia::head>
            <title>{{ config('app.name') }}</title>
        </x-inertia::head>

        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    </head>
    <body class="antialiased">
        <x-inertia::app />
    </body>
</html>
