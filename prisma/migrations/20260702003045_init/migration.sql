-- CreateTable
CREATE TABLE `trip_requests` (
    `id` VARCHAR(191) NOT NULL,
    `requesterName` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `departureAt` DATETIME(3) NOT NULL,
    `returnAt` DATETIME(3) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `passengerCount` INTEGER NOT NULL,
    `status` ENUM('pending', 'canceled') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
