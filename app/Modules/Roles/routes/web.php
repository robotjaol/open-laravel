<?php

use App\Modules\Roles\Http\Controllers\PermissionController;
use App\Modules\Roles\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
Route::get('roles/create', [RoleController::class, 'create'])->name('roles.create');
Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
Route::put('permissions/toggle', [PermissionController::class, 'toggle'])->name('permissions.toggle');
