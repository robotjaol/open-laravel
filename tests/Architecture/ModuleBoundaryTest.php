<?php

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;

/**
 * Enforces the modular-monolith dependency rules by scanning `use` statements.
 */
class ModuleBoundaryTest extends TestCase
{
    /** @return list<string> */
    private function phpFiles(string $dir): array
    {
        $out = [];
        $it = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS));
        foreach ($it as $file) {
            if ($file->getExtension() === 'php') {
                $out[] = $file->getPathname();
            }
        }

        return $out;
    }

    public function test_core_and_shared_never_depend_on_modules(): void
    {
        foreach ([...$this->phpFiles(dirname(__DIR__, 2).'/app/Core'), ...$this->phpFiles(dirname(__DIR__, 2).'/app/Shared')] as $file) {
            $this->assertDoesNotMatchRegularExpression(
                '/^use App\\\\Modules\\\\/m',
                (string) file_get_contents($file),
                "$file must not import from App\\Modules",
            );
        }
    }

    public function test_modules_do_not_import_other_modules(): void
    {
        $base = dirname(__DIR__, 2).'/app/Modules';
        foreach (glob($base.'/*', GLOB_ONLYDIR) as $moduleDir) {
            $name = basename($moduleDir);
            foreach ($this->phpFiles($moduleDir) as $file) {
                preg_match_all('/^use App\\\\Modules\\\\([A-Za-z]+)\\\\/m', (string) file_get_contents($file), $m);
                foreach ($m[1] as $imported) {
                    $this->assertSame($name, $imported, "$file imports module $imported from module $name");
                }
            }
        }
    }

    public function test_controllers_do_not_use_raw_db_queries(): void
    {
        foreach ($this->phpFiles(dirname(__DIR__, 2).'/app/Modules') as $file) {
            if (str_contains($file, 'Controllers')) {
                $this->assertStringNotContainsString('DB::raw', (string) file_get_contents($file), $file);
            }
        }
    }
}
