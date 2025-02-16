#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <arpa/inet.h>

#define BUFFER_SIZE 1024

void *recvInput(void *client_socket);

int main(int argc, char *argv[]) {
    if (argc != 2) {
        perror("arguments");
        exit(EXIT_FAILURE);
    }

    int port = atoi(argv[1]);
    int server_fd, client_socket;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_addr_len = sizeof(client_addr);
    
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(port);
    server_addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 5) < 0) {
        perror("listen");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    printf("Server listening");

    while (1) {
        client_socket = accept(server_fd, (struct sockaddr *)&client_addr, &client_addr_len);
        if (client_socket == -1) {
            perror("accept");
            continue;
        }

        printf("Client connected\n");

        // Create a new thread to handle the client
        pthread_t thread;
        if (pthread_create(&thread, NULL, recvInput, (void *)&client_socket) != 0) {
            perror("pthread_create");
            close(client_socket);
            continue;
        }
        pthread_detach(thread);
    }
    close(server_fd);
    return 0;
}

void *recvInput(void *client_socket) {
    int sock = *(int *)client_socket;
    char buffer[BUFFER_SIZE];
    ssize_t bytes_received;
    FILE *file;
    char filename[100];

    if ((bytes_received = recv(sock, filename, sizeof(filename) - 1, 0)) <= 0) {
        perror("recv");
        close(sock);
        return NULL;
    }
    filename[bytes_received] = '\0';

    file = fopen(filename, "wb");
    if (file == NULL) {
        perror("fopen");
        close(sock);
        return NULL;
    }

    while ((bytes_received = recv(sock, buffer, sizeof(buffer), 0)) > 0) {
        fwrite(buffer, 1, bytes_received, file);
    }

    if (bytes_received < 0) {
        perror("recv");
    } else {
        printf("File received successfully.\n");
    }

    fclose(file);
    close(sock);
    return NULL;
}
