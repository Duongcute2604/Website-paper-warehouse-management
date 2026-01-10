using System;

class KnightTour
{
    static int N = 8;  // kích thước bàn cờ
    static int[,] board = new int[N, N];

    // 8 hướng đi của quân mã
    static int[] dx = { 2, 1, -1, -2, -2, -1, 1, 2 };
    static int[] dy = { 1, 2, 2, 1, -1, -2, -2, -1 };

    static bool IsSafe(int x, int y)
    {
        return (x >= 0 && x < N && y >= 0 && y < N && board[x, y] == -1);
    }

    static int GetDegree(int x, int y)
    {
        int count = 0;
        for (int i = 0; i < 8; i++)
        {
            int nx = x + dx[i];
            int ny = y + dy[i];
            if (IsSafe(nx, ny)) count++;
        }
        return count;
    }

    static bool WarnsdorffMove(ref int x, ref int y, int movei)
    {
        int minDeg = 9, nextX = -1, nextY = -1;

        for (int i = 0; i < 8; i++)
        {
            int nx = x + dx[i];
            int ny = y + dy[i];

            if (IsSafe(nx, ny))
            {
                int deg = GetDegree(nx, ny);
                if (deg < minDeg)
                {
                    minDeg = deg;
                    nextX = nx;
                    nextY = ny;
                }
            }
        }

        if (nextX == -1) return false;

        x = nextX;
        y = nextY;
        board[x, y] = movei;
        return true;
    }

    static bool SolveKnightTour(int startX = 0, int startY = 0)
    {
        // khởi tạo bàn cờ
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                board[i, j] = -1;

        int x = startX, y = startY;
        board[x, y] = 0;

        for (int movei = 1; movei < N * N; movei++)
        {
            if (!WarnsdorffMove(ref x, ref y, movei))
                return false;
        }

        return true;
    }

    static void PrintBoard()
    {
        Console.WriteLine("\n------------------------------------------------------");
        Console.WriteLine("Ma trận bàn cờ (số thứ tự các bước đi từ 0 → 63):");
        Console.WriteLine("------------------------------------------------------\n");

        for (int i = 0; i < N; i++)
        {
            for (int j = 0; j < N; j++)
                Console.Write($"{board[i, j],3} ");
            Console.WriteLine();
        }
    }

    static void Main()
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;

        Console.WriteLine("=======================================================");
        Console.WriteLine("              BÀI TOÁN MÃ ĐI TUẦN (KNIGHT TOUR)");
        Console.WriteLine("=======================================================");
        Console.WriteLine("Thuật toán sử dụng: Quy tắc Warnsdorff");
        Console.WriteLine("Bàn cờ: 8 x 8");
        Console.WriteLine("Quân mã phải đi qua tất cả các ô đúng 1 lần.");
        Console.WriteLine("-------------------------------------------------------\n");

        Console.WriteLine("Nhập vị trí bắt đầu của quân mã:");
        Console.Write("Hàng (0-7): ");
        int x = int.Parse(Console.ReadLine());
        Console.Write("Cột (0-7): ");
        int y = int.Parse(Console.ReadLine());

        Console.WriteLine("\nĐang tìm lời giải, vui lòng chờ...\n");

        if (SolveKnightTour(x, y))
        {
            Console.WriteLine("✔ Tìm được lời giải hợp lệ!\n");
            PrintBoard();
            Console.WriteLine("\nKết luận: Tồn tại hành trình mã đi tuần với xuất phát điểm bạn chọn.");
        }
        else
        {
            Console.WriteLine("❌ Không tìm được lời giải cho vị trí này.");
        }

        Console.WriteLine("\n=================== KẾT THÚC CHƯƠNG TRÌNH ===================");
        Console.ReadKey();
    }
}
