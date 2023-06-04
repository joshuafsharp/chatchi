-- Create Users Table
CREATE TABLE users (
    "id" UUID NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- Create Pets Table
CREATE TABLE pets (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "owner_id" UUID REFERENCES users(id),
    
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'cat',

    "energy" FLOAT4 NOT NULL DEFAULT 100,
    "happiness" FLOAT4 NOT NULL DEFAULT 100,
    "hunger" FLOAT4 NOT NULL DEFAULT 100,
    "thirst" FLOAT4 NOT NULL DEFAULT 100,
    
    "last_interaction" TIMESTAMP NOT NULL DEFAULT now()
);

-- Create UserPets Table
CREATE TABLE user_pets (
    "user_id" UUID REFERENCES users(id),
    "pet_id" UUID REFERENCES pets(id),

    PRIMARY KEY(user_id, pet_id)
);

-- Create Sessions Table
CREATE TABLE sessions (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES users(id),

    "start_time" TIMESTAMP NOT NULL DEFAULT now(),
    "last_interaction" TIMESTAMP NOT NULL DEFAULT now(),
    "end_time" TIMESTAMP
);

-- Create Conversations Table
CREATE TABLE conversations (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES users(id),
    "pet_id" UUID NOT NULL REFERENCES pets(id),
    "session_id" UUID REFERENCES sessions(id),
    
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,

    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Row level security policies

-- Users can access their own data

alter table users
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_self_only
  ON users
  FOR ALL
  USING (auth.uid() = id);

-- Users can only access their own pets

alter table pets
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY pets_self_only
  ON pets
  FOR ALL
  USING (auth.uid() = owner_id);

-- Users can access their own conversations

alter table conversations
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY conversations_self_only
  ON conversations
  FOR ALL
  USING (auth.uid() = user_id);

-- Users can access their own user_pets entries
alter table user_pets
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_pets_self_only
  ON user_pets
  FOR ALL
  USING (auth.uid() = user_id);

-- Users can access their own sessions

alter table sessions
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_session_self_only
  ON sessions
  FOR ALL
  USING (auth.uid() = user_id);