#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <fcntl.h>

#define BUFFER_SIZE 1024

int main(int argc, char *argv[]) {
    if (argc != 4) {
        fprintf(stderr, "Usage: %s <server_ip> <port> <filename>\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    const char *server_ip = argv[1];
    int port = atoi(argv[2]);
    const char *filename = argv[3];

    int sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }

    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(port);

    if (inet_pton(AF_INET, server_ip, &server_addr.sin_addr) <= 0) {
        perror("Invalid address or address not supported");
        exit(EXIT_FAILURE);
    }

    //open file
    int file_fd = open(filename, O_RDONLY);
    if (file_fd < 0) {
        perror("Failed to open file");
        close(sockfd);
        exit(EXIT_FAILURE);
    }
    printf("Sending file: %s to %s:%d\n", filename, server_ip, port);

    // Send filename to server (now not utilized in backend)
    if (sendto(sockfd, filename, strlen(filename), 0,
               (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Failed to send filename");
        close(file_fd);
        close(sockfd);
        exit(EXIT_FAILURE);
    }

    char buffer[BUFFER_SIZE];
    ssize_t bytes_read;
    while ((bytes_read = read(file_fd, buffer, BUFFER_SIZE)) > 0) {
        if (sendto(sockfd, buffer, bytes_read, 0,
                   (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
            perror("Failed to send file data");
            close(file_fd);
            close(sockfd);
            exit(EXIT_FAILURE);
        }
        //
    }

    const char *end_marker = "END";
    if (sendto(sockfd, end_marker, strlen(end_marker), 0,
               (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Failed to send end marker");
        close(file_fd);
        close(sockfd);
        exit(EXIT_FAILURE);
    }
    printf("File sent successfully.\n");

    close(file_fd);
    close(sockfd);

    return 0;
}