class AuthToken < ActiveRecord::Base
  attr_accessible :token, :user_id, :activated

  scope :active, where(:activated => true)

  before_create :generate_token
  validates_uniqueness_of :token

  belongs_to :user

  protected

  def generate_token
    return if self.token
    self.token = loop do
      token = SecureRandom.urlsafe_base64(32)
      break token unless AuthToken.where(:token => token).exists?
    end
  end

end
