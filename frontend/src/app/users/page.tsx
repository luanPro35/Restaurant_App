'use client';

import React, { useEffect, useState } from 'react';
import { User, Role } from '../../types';
import apiService from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Users, Search, Mail, Phone, RefreshCw } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    await apiService.updateUserRole(userId, newRole);
    fetchUsers();
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-[#E07B39]" />
            Quản Lý Nhân Viên & Khách Hàng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Phân quyền hệ thống (Admin, Nhân viên phục vụ/bếp, Khách hàng).
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#E07B39]' : ''}`} />
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'ADMIN', 'STAFF', 'USER'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === r
                  ? 'bg-[#E07B39] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL' ? 'Tất cả' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Người dùng</th>
                <th className="px-5 py-3.5">Liên hệ</th>
                <th className="px-5 py-3.5">Vai trò hiện tại</th>
                <th className="px-5 py-3.5">Ngày tham gia</th>
                <th className="px-5 py-3.5 text-right">Phân quyền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-[#E07B39] font-bold text-sm flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-[11px] text-slate-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-700 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <Badge status={user.role} type="role" />
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">{user.createdAt}</td>

                  <td className="px-5 py-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
                    >
                      <option value="USER">USER (Khách)</option>
                      <option value="STAFF">STAFF (Nhân viên)</option>
                      <option value="ADMIN">ADMIN (Quản trị)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
