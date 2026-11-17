<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
 * Tables for spatie/laravel-permission (teams disabled). Table and column names come from the
 * package configuration so a published config override is honoured.
 */
return new class extends Migration
{
    public function up(): void
    {
        $tables = config('permission.table_names');
        $columns = config('permission.column_names');
        $rolePivot = $columns['role_pivot_key'] ?? 'role_id';
        $permissionPivot = $columns['permission_pivot_key'] ?? 'permission_id';
        $morphKey = $columns['model_morph_key'] ?? 'model_id';

        Schema::create($tables['permissions'], function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();
            $table->unique(['name', 'guard_name']);
        });

        Schema::create($tables['roles'], function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();
            $table->unique(['name', 'guard_name']);
        });

        Schema::create($tables['model_has_permissions'], function (Blueprint $table) use ($tables, $permissionPivot, $morphKey) {
            $table->unsignedBigInteger($permissionPivot);
            $table->string('model_type');
            $table->unsignedBigInteger($morphKey);
            $table->index([$morphKey, 'model_type'], 'model_has_permissions_model_id_model_type_index');
            $table->foreign($permissionPivot)->references('id')->on($tables['permissions'])->onDelete('cascade');
            $table->primary([$permissionPivot, $morphKey, 'model_type'], 'model_has_permissions_permission_model_type_primary');
        });

        Schema::create($tables['model_has_roles'], function (Blueprint $table) use ($tables, $rolePivot, $morphKey) {
            $table->unsignedBigInteger($rolePivot);
            $table->string('model_type');
            $table->unsignedBigInteger($morphKey);
            $table->index([$morphKey, 'model_type'], 'model_has_roles_model_id_model_type_index');
            $table->foreign($rolePivot)->references('id')->on($tables['roles'])->onDelete('cascade');
            $table->primary([$rolePivot, $morphKey, 'model_type'], 'model_has_roles_role_model_type_primary');
        });

        Schema::create($tables['role_has_permissions'], function (Blueprint $table) use ($tables, $rolePivot, $permissionPivot) {
            $table->unsignedBigInteger($permissionPivot);
            $table->unsignedBigInteger($rolePivot);
            $table->foreign($permissionPivot)->references('id')->on($tables['permissions'])->onDelete('cascade');
            $table->foreign($rolePivot)->references('id')->on($tables['roles'])->onDelete('cascade');
            $table->primary([$permissionPivot, $rolePivot], 'role_has_permissions_permission_id_role_id_primary');
        });

        app('cache')
            ->store(config('permission.cache.store') !== 'default' ? config('permission.cache.store') : null)
            ->forget(config('permission.cache.key'));
    }

    public function down(): void
    {
        $tables = config('permission.table_names');

        Schema::drop($tables['role_has_permissions']);
        Schema::drop($tables['model_has_roles']);
        Schema::drop($tables['model_has_permissions']);
        Schema::drop($tables['roles']);
        Schema::drop($tables['permissions']);
    }
};
