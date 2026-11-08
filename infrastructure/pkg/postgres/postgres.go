package postgres

import (
	"context"

	"github.com/jackc/pgx/v5"
)

// DB is a thin wrapper around a PostgreSQL connection
type DB struct {
	conn *pgx.Conn
}

// Connect opens a connection to the PostgreSQL server
func Connect(uri string) (db *DB, err error) {
	conn, err := pgx.Connect(context.Background(), uri)
	if err != nil {
		return
	}

	return &DB{conn: conn}, nil
}

// Close closes the database connection
func (d *DB) Close() error {
	return d.conn.Close(context.Background())
}

// SetContainerID stores the ID of the container which has been created
// for a deployment
func (d *DB) SetContainerID(deploymentID string, containerID string) (err error) {
	_, err = d.conn.Exec(
		context.Background(),
		`UPDATE "image" SET "container_id" = $1 WHERE "id" = $2`,
		containerID,
		deploymentID,
	)
	return
}
