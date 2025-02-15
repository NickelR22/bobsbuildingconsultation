#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <fcntl.h>

#define BUFFER_SIZE 1024

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <port>\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    int port = atoi(argv[1]);
    const char *output_filename = argv[2];
    
    int server_fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (server_fd < 0) {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }

    struct sockaddr_in server_addr, client_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(port);
    server_addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Bind failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    printf("Server running on port %d...\n", port);

    char filename[256];
    socklen_t client_len = sizeof(client_addr);
    ssize_t bytes_received = recvfrom(server_fd, filename, sizeof(filename)-1, 0,
                                    (struct sockaddr *)&client_addr, &client_len);

    int file_fd = open(output_filename, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (file_fd < 0) {
        perror("Failed to create file");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    char buffer[BUFFER_SIZE];
    while (1) {
        bytes_received = recvfrom(server_fd, buffer, BUFFER_SIZE, 0,
                                (struct sockaddr *)&client_addr, &client_len);
        if (bytes_received < 0) {
            perror("Failed to receive data");
            close(file_fd);
            close(server_fd);
            exit(EXIT_FAILURE);
        }
        
        if (bytes_received == 0 || bytes_received == 3 && memcmp(buffer, "END", 3) == 0) {
            printf("Transmission complete.\n");
            break;
        }

        if (write(file_fd, buffer, bytes_received) < 0) {
            perror("Failed to write to file");
            close(file_fd);
            close(server_fd);
            exit(EXIT_FAILURE);
        }
    }

    printf("File received successfully.\n");

    close(file_fd);
    close(server_fd);

    return 0;
}

