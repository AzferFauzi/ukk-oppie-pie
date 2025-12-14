import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // Helper to calculate total from orders
        const getRevenue = async (fromDate: Date, toDate?: Date) => {
            const whereClause: any = {
                createdAt: {
                    gte: fromDate,
                },
            };

            if (toDate) {
                whereClause.createdAt.lte = toDate;
            }

            const orders = await prisma.order.findMany({
                where: whereClause,
                select: {
                    total: true,
                },
            });
            return orders.reduce((sum, order) => sum + order.total, 0);
        };

        // Calculate chart data (Last 7 days)
        const chartData = [];
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dayName = days[d.getDay()];

            // Start of that day
            const startOfDay = new Date(d);
            startOfDay.setHours(0, 0, 0, 0);

            // End of that day
            const endOfDay = new Date(d);
            endOfDay.setHours(23, 59, 59, 999);

            const dailyTotal = await getRevenue(startOfDay, endOfDay);
            chartData.push({
                name: dayName,
                total: dailyTotal
            });
        }

        const [daily, weekly, monthly, yearly] = await Promise.all([
            getRevenue(today),
            getRevenue(startOfWeek),
            getRevenue(startOfMonth),
            getRevenue(startOfYear),
        ]);

        return NextResponse.json({
            daily,
            weekly,
            monthly,
            yearly,
            chartData
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
