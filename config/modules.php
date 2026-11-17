<?php

return [
    /*
     | Modules found in app/Modules are auto-discovered. List module folder names here
     | (comma separated in DISABLED_MODULES) to switch them off without deleting code.
     */
    'disabled' => array_values(array_filter(array_map('trim', explode(',', (string) env('DISABLED_MODULES', ''))))),
];
