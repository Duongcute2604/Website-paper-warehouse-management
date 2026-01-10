
# -*- coding: utf-8 -*-
import time
class BangBam:
    def __init__(self, kich_thuoc):
        self.kich_thuoc = kich_thuoc
        self.bucket = [[] for _ in range(kich_thuoc)]  # mỗi bucket là một danh sách
    def ham_bam(self, key):
        return hash(key) % self.kich_thuoc  
    def chen(self, key, value):
        index = self.ham_bam(key)
        # Nếu key đã tồn tại thì cập nhật
        for i, (k, v) in enumerate(self.bucket[index]): 
            if k == key:
                self.bucket[index][i] = (key, value)
                return
        # Nếu chưa có thì thêm mới
        self.bucket[index].append((key, value))
    def tim(self, key):
        index = self.ham_bam(key)
        for k, v in self.bucket[index]:
            if k == key:
                return v
        return None
# Hàm nhập số nguyên dương
def nhap_so_nguyen_duong(thong_bao):
    while True:
        try:
            n = int(input(thong_bao))
            if n > 0:
                return n
            else:
                print("Vui lòng nhập số nguyên dương")
        except ValueError:
            print("Vui lòng nhập số nguyên hợp lệ.")
# Người dùng nhập dữ liệu
kich_thuoc = nhap_so_nguyen_duong("Nhập số lượng bucket(lưu dữ liệu): ")
N = nhap_so_nguyen_duong("Nhập số lượng dữ liệu cần tạo: ")
bang_bam = BangBam(kich_thuoc=kich_thuoc)
# Tạo dữ liệu lớn
danh_sach_sinh_vien = [(f"SV{i}", f"Ten_{i}") for i in range(N)]
# Chèn dữ liệu vào bảng băm
bat_dau = time.time()
for i in range(N):
    bang_bam.chen(f"SV{i}", f"Ten_{i}")
ket_thuc = time.time()
print(f"Thời gian chèn vào bảng băm: {ket_thuc - bat_dau:.6f} giây")
# Người dùng nhập mã cần tìm
key_can_tim = input("Nhập mã sinh viên cần tìm (ví dụ SV10): ")
# Tìm trong list
bat_dau = time.time()
ket_qua_list = None
for k, v in danh_sach_sinh_vien:
    if k == key_can_tim:
        ket_qua_list = v
        break
ket_thuc = time.time()
print(f"Tìm trong danh sách: {ket_qua_list}, thời gian = {ket_thuc - bat_dau:.6f} giây")
# Tìm trong bảng băm
bat_dau = time.time()
ket_qua_bang_bam = bang_bam.tim(key_can_tim)
ket_thuc = time.time()
print(f"Tìm trong bảng băm: {ket_qua_bang_bam}, thời gian = {ket_thuc - bat_dau:.6f} giây")