using System;
using System.Diagnostics;
using System.Linq;

namespace SearchAlgorithmsDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.WriteLine("=== DEMO THUẬT TOÁN TÌM KIẾM TRONG C# ===\n");

            while (true)
            {
                Console.WriteLine("CHỌN CHỨC NĂNG:");
                Console.WriteLine("1. Demo cơ bản với dữ liệu nhỏ");
                Console.WriteLine("2. So sánh hiệu năng với dữ liệu lớn");
                Console.WriteLine("3. Demo với dữ liệu chưa sắp xếp");
                Console.WriteLine("4. Thoát");
                Console.Write("Lựa chọn của bạn (1-4): ");

                string choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        DemoSmallExample();
                        break;
                    case "2":
                        DemoPerformanceComparison();
                        break;
                    case "3":
                        DemoUnsortedData();
                        break;
                    case "4":
                        Console.WriteLine("Cảm ơn đã sử dụng chương trình!");
                        return;
                    default:
                        Console.WriteLine("Lựa chọn không hợp lệ! Vui lòng chọn lại.\n");
                        break;
                }

                Console.WriteLine("\n" + new string('=', 60) + "\n");
            }
        }

        static void DemoSmallExample()
        {
            Console.WriteLine("\n=== VÍ DỤ MINH HỌA VỚI DỮ LIỆU NHỎ ===\n");

            int[] data = { 2, 5, 8, 12, 16, 23, 38, 45, 67, 89 };
            int target = 23;

            Console.WriteLine($"Mảng: [{string.Join(", ", data)}]");
            Console.WriteLine($"Phần tử cần tìm: {target}\n");

            // Tìm kiếm tuần tự
            Console.WriteLine("1. TÌM KIẾM TUẦN TỰ:");
            int resultSequential = SequentialSearch(data, target, true);
            Console.WriteLine($"Kết quả: Tìm thấy tại vị trí {resultSequential}\n");

            // Tìm kiếm nhị phân
            Console.WriteLine("2. TÌM KIẾM NHỊ PHÂN:");
            int resultBinary = BinarySearchIterative(data, target, true);
            Console.WriteLine($"Kết quả: Tìm thấy tại vị trí {resultBinary}");
        }

        static void DemoPerformanceComparison()
        {
            Console.WriteLine("\n=== SO SÁNH HIỆU NĂNG VỚI DỮ LIỆU LỚN ===\n");

            int size = 100000;
            int[] data = GenerateSortedArray(size);
            int target = data[new Random().Next(0, size)];

            Console.WriteLine($"Kích thước dữ liệu: {size:N0} phần tử");
            Console.WriteLine($"Phần tử cần tìm: {target}");
            Console.WriteLine($"Vị trí thực tế: {Array.IndexOf(data, target)}\n");

            var stopwatch = new Stopwatch();

            // Tìm kiếm tuần tự
            stopwatch.Start();
            int resultSeq = SequentialSearch(data, target);
            stopwatch.Stop();
            long timeSeq = stopwatch.ElapsedTicks;

            // Tìm kiếm nhị phân (lặp)
            stopwatch.Restart();
            int resultBinIter = BinarySearchIterative(data, target);
            stopwatch.Stop();
            long timeBinIter = stopwatch.ElapsedTicks;

            // Tìm kiếm nhị phân (đệ quy)
            stopwatch.Restart();
            int resultBinRec = BinarySearchRecursive(data, target);
            stopwatch.Stop();
            long timeBinRec = stopwatch.ElapsedTicks;

            Console.WriteLine("KẾT QUẢ THỜI GIAN THỰC THI:");
            Console.WriteLine($"Tìm kiếm tuần tự:     {timeSeq,10} ticks - Kết quả: {resultSeq}");
            Console.WriteLine($"Tìm kiếm nhị phân (lặp): {timeBinIter,10} ticks - Kết quả: {resultBinIter}");
            Console.WriteLine($"Tìm kiếm nhị phân (đệ quy): {timeBinRec,10} ticks - Kết quả: {resultBinRec}");

            if (timeSeq > 0 && timeBinIter > 0)
            {
                double speedup = (double)timeSeq / timeBinIter;
                Console.WriteLine($"\nTìm kiếm nhị phân (lặp) nhanh hơn {speedup:F2} lần so với tìm kiếm tuần tự");
            }
        }

        static void DemoUnsortedData()
        {
            Console.WriteLine("\n=== TÌM KIẾM TRONG DỮ LIỆU CHƯA SẮP XẾP ===\n");

            int[] unsortedData = { 45, 23, 8, 67, 12, 89, 2, 38, 16, 5 };
            int target = 23;

            Console.WriteLine($"Mảng chưa sắp xếp: [{string.Join(", ", unsortedData)}]");
            Console.WriteLine($"Phần tử cần tìm: {target}\n");

            // Chỉ có thể dùng tìm kiếm tuần tự
            Console.WriteLine("1. TÌM KIẾM TUẦN TỰ (làm việc được):");
            int result1 = SequentialSearch(unsortedData, target, true);

            Console.WriteLine("\n2. TÌM KIẾM NHỊ PHÂN (có thể cho kết quả sai):");

            // Cảnh báo về dữ liệu chưa sắp xếp
            if (!IsSorted(unsortedData))
            {
                Console.WriteLine("CẢNH BÁO: Mảng chưa được sắp xếp, kết quả có thể không chính xác!");
            }

            int result2 = BinarySearchIterative(unsortedData, target, true);

            Console.WriteLine($"\nKết luận: Với dữ liệu chưa sắp xếp, chỉ nên dùng Tìm kiếm tuần tự");
        }

        // CÁC THUẬT TOÁN TÌM KIẾM
        public static int SequentialSearch(int[] arr, int target, bool showSteps = false)
        {
            if (showSteps)
            {
                Console.WriteLine("   Các bước thực hiện:");
            }

            for (int i = 0; i < arr.Length; i++)
            {
                if (showSteps)
                {
                    Console.WriteLine($"   Bước {i + 1}: So sánh với arr[{i}] = {arr[i]}");
                }

                if (arr[i] == target)
                {
                    if (showSteps)
                    {
                        Console.WriteLine($"   => Tìm thấy tại vị trí {i} sau {i + 1} bước");
                    }
                    return i;
                }
            }

            if (showSteps)
            {
                Console.WriteLine("   => Không tìm thấy phần tử");
            }
            return -1;
        }

        public static int BinarySearchIterative(int[] arr, int target, bool showSteps = false)
        {
            int low = 0;
            int high = arr.Length - 1;
            int steps = 0;

            if (showSteps)
            {
                Console.WriteLine("   Các bước thực hiện:");
            }

            while (low <= high)
            {
                steps++;
                int mid = (low + high) / 2;

                if (showSteps)
                {
                    Console.WriteLine($"   Bước {steps}: low={low}, high={high}, mid={mid}, arr[{mid}]={arr[mid]}");
                }

                if (arr[mid] == target)
                {
                    if (showSteps)
                    {
                        Console.WriteLine($"   => Tìm thấy tại vị trí {mid} sau {steps} bước");
                    }
                    return mid;
                }
                else if (arr[mid] < target)
                {
                    low = mid + 1;
                    if (showSteps)
                    {
                        Console.WriteLine($"      => Tìm nửa sau: low={low}, high={high}");
                    }
                }
                else
                {
                    high = mid - 1;
                    if (showSteps)
                    {
                        Console.WriteLine($"      => Tìm nửa đầu: low={low}, high={high}");
                    }
                }
            }

            if (showSteps)
            {
                Console.WriteLine("   => Không tìm thấy phần tử");
            }
            return -1;
        }

        public static int BinarySearchRecursive(int[] arr, int target)
        {
            return BinarySearchRecursiveHelper(arr, target, 0, arr.Length - 1);
        }

        private static int BinarySearchRecursiveHelper(int[] arr, int target, int low, int high)
        {
            if (low > high)
            {
                return -1;
            }

            int mid = (low + high) / 2;

            if (arr[mid] == target)
            {
                return mid;
            }
            else if (arr[mid] < target)
            {
                return BinarySearchRecursiveHelper(arr, target, mid + 1, high);
            }
            else
            {
                return BinarySearchRecursiveHelper(arr, target, low, mid - 1);
            }
        }

        public static bool IsSorted(int[] arr)
        {
            for (int i = 1; i < arr.Length; i++)
            {
                if (arr[i] < arr[i - 1])
                {
                    return false;
                }
            }
            return true;
        }

        private static int[] GenerateSortedArray(int size)
        {
            Random random = new Random();
            int[] array = new int[size];

            for (int i = 0; i < size; i++)
            {
                array[i] = random.Next(1, size * 10);
            }

            Array.Sort(array);
            return array;
        }
    }
}